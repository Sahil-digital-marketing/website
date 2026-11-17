import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, '.artifacts', 'homepage')
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
let chromePath
for (const candidate of chromeCandidates) {
  try { await fs.access(candidate); chromePath = candidate; break } catch { /* Try the next browser path. */ }
}
assert.ok(chromePath, 'Chrome is required; set CHROME_PATH to your Chrome/Chromium executable')
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'sahil-homepage-'))
await fs.mkdir(output, { recursive: true })
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff' }
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const target = path.resolve(root, 'dist', '.' + (pathname === '/' ? '/index.html' : pathname))
    assert.ok(target.startsWith(path.join(root, 'dist') + path.sep))
    response.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream')
    response.end(await fs.readFile(target))
  } catch {
    response.writeHead(404).end()
  }
})
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const url = `http://127.0.0.1:${server.address().port}`
const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' })

let socket
const pending = new Map()
const runtimeErrors = []
let sequence = 0
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitFor(check, description) {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const value = await check()
      if (value) return value
    } catch { /* The browser may still be starting. */ }
    await delay(100)
  }
  throw new Error(`Timed out: ${description}`)
}

function send(method, params = {}) {
  const id = ++sequence
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 15000)
    pending.set(id, { resolve, reject, timeout })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`)
  const point = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 })
}

async function screenshot(name, fullPage = false) {
  const metrics = await send('Page.getLayoutMetrics')
  const options = { format: 'png', captureBeyondViewport: fullPage }
  if (fullPage) options.clip = { x: 0, y: 0, width: metrics.cssContentSize.width, height: metrics.cssContentSize.height, scale: 1 }
  const shot = await send('Page.captureScreenshot', options)
  await fs.writeFile(path.join(output, name + '.png'), Buffer.from(shot.data, 'base64'))
}

const results = []
try {
  const portFile = await waitFor(() => fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8'), 'browser startup')
  const port = Number(portFile.split('\n')[0])
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl)
  await once(socket, 'open')
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails)
    const callback = pending.get(message.id)
    if (!callback) return
    clearTimeout(callback.timeout)
    pending.delete(message.id)
    if (message.error) callback.reject(new Error(message.error.message))
    else callback.resolve(message.result)
  })
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  for (const theme of ['dark', 'light']) {
    for (const width of [375, 768, 1024, 1440]) {
      const height = width === 375 ? 812 : width === 768 ? 1024 : 900
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }] })
      if (results.length) await evaluate('localStorage.clear()')
      await send('Page.navigate', { url })
      await waitFor(() => evaluate('Boolean(document.querySelector(".motion-toggle"))'), '3D scene')
      await evaluate('document.fonts.ready.then(() => true)')
      await delay(350)
      const metrics = await evaluate(`({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', headings: document.querySelectorAll('h1').length, sections: document.querySelectorAll('main > section').length, canvas: document.querySelector('canvas').classList.contains('is-ready'), links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.getAttribute('href').slice(1))) })`)
      assert.ok(metrics.scrollWidth <= width, `Overflow at ${width} ${theme}`)
      assert.equal(metrics.theme, theme)
      assert.equal(metrics.headings, 1)
      assert.ok(metrics.links, 'Anchor destinations exist')
      assert.ok(metrics.canvas, '3D rendered')
      if (width === 375) {
        await click('.menu-toggle')
        await waitFor(() => evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "true"'), 'menu opens')
        assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'true')
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' })
        await waitFor(() => evaluate('!document.querySelector(".mobile-navigation-panel")'), 'menu dismisses')
        assert.equal(await evaluate('document.activeElement.className'), 'menu-toggle')
        assert.equal(await evaluate('document.querySelector(".mobile-navigation-panel")'), null)
      }
      await click('.motion-toggle')
      await waitFor(() => evaluate('document.querySelector(".motion-toggle").getAttribute("aria-pressed") === "true"'), 'motion pauses')
      assert.equal(await evaluate('document.querySelector(".motion-toggle").getAttribute("aria-pressed")'), 'true')
      await evaluate('scrollTo({top:0,behavior:"instant"})')
      await screenshot(`${theme}-${width}`, width === 375 || width === 1440)
      results.push({ ...metrics, menu: width === 375 ? 'pass' : 'not applicable', pause: 'pass' })
      console.log(`${theme} ${width}: layout, anchors, 3D, pause${width === 375 ? ', menu and Escape' : ''} passed`)
    }
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  await waitFor(() => evaluate('Boolean(document.querySelector(".theme-toggle"))'), 'theme control')
  await click('.theme-toggle')
  await waitFor(() => evaluate('localStorage.getItem("sahil-theme") === "dark"'), 'theme changes')
  assert.equal(await evaluate('localStorage.getItem("sahil-theme")'), 'dark')
  await send('Page.reload')
  await waitFor(() => evaluate('Boolean(document.querySelector(".theme-toggle"))'), 'persisted theme')
  assert.equal(await evaluate('document.documentElement.classList.contains("dark")'), true)

  await evaluate('document.querySelector(".faq-item summary").click()')
  assert.equal(await evaluate('document.querySelector(".faq-item").open'), true)
  assert.equal(await evaluate('document.querySelector("form").checkValidity()'), false)
  await evaluate(`(() => { for (const [name,value] of Object.entries({name:'Test Business',email:'test@example.com',project:'A business website and marketing enquiry.'})) document.querySelector('[name="'+name+'"]').value=value; document.querySelector('[name="service"]').selectedIndex=1; document.querySelector('form').requestSubmit() })()`)
  assert.match(await evaluate('document.querySelector(".form-status").textContent'), /not sent or saved/)

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await evaluate('scrollTo({top:0,behavior:"instant"})')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".hero-copy h1")).animationName'), 'none')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".motion-toggle")).display'), 'none')
  await screenshot('reduced-motion')
  await evaluate('localStorage.clear()')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `const getContext = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type,...args) { return type === 'webgl2' ? null : getContext.call(this,type,...args) }` })
  await send('Page.reload')
  await waitFor(() => evaluate('Boolean(document.querySelector(".eagle-still"))'), 'WebGL fallback')
  await delay(300)
  assert.equal(await evaluate('document.querySelector(".eagle-canvas").classList.contains("is-ready")'), false)
  await screenshot('webgl-fallback')
  assert.equal(runtimeErrors.length, 0, 'No runtime exceptions')
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ results, runtimeErrors, themePersistence: 'pass', faq: 'pass', formPreview: 'pass', reducedMotion: 'pass', webglFallback: 'pass' }, null, 2))
  console.log('Theme persistence, FAQ, form validation/preview, reduced motion, WebGL fallback, runtime errors: passed')
  console.log(`Screenshots: ${output}`)
} finally {
  socket?.close()
  chrome.kill()
  server.close()
}
