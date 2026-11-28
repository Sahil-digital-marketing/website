import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runServiceChecks } from './check-services.mjs'
import { runProcessChecks } from './check-process.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const servicesCheck = process.argv.includes('--services')
const processCheck = process.argv.includes('--process')
const output = path.join(root, '.artifacts', processCheck ? 'process' : servicesCheck ? 'services' : 'homepage')
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
const url = process.env.SAHIL_BASE_URL || 'http://127.0.0.1:4173'
const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', 'about:blank',
], { windowsHide: true, stdio: 'ignore' })

let socket
const pending = new Map()
const runtimeErrors = []
const imageRequests = new Set()
const failedResponses = []
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
  await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)}); const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > innerHeight) el.scrollIntoView({block:'center',behavior:'instant'});
  })()`)
  await delay(400) // Let smooth-scroll state and scroll-triggered layout settle.
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

async function checkImages(selector = 'img') {
  const images = await evaluate(`(async () => {
    const images = [...document.querySelectorAll(${JSON.stringify(selector)})];
    await Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() }));
    return images.map(image => ({ src: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight, sized: image.hasAttribute('width') && image.hasAttribute('height'), responsive: Boolean(image.srcset && image.sizes), alt: image.getAttribute('alt') }));
  })()`)
  for (const image of images) {
    assert.ok(image.src.startsWith(url + '/'), `Local image: ${image.src}`)
    assert.ok(image.width && image.height && image.sized, `Loaded, dimensioned image: ${image.src}`)
    if (image.src.includes('/images/home/')) assert.ok(image.responsive, 'Editorial photos have responsive sources')
    assert.notEqual(image.alt, null, 'Alt attribute is present')
  }
  return images.length
}

async function sectionScreenshot(selector, name) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`)
  await delay(500)
  // Keep the viewport fixed: oversized CDP clips can alter viewport-dependent layouts.
  await screenshot(name)
}

async function keypress(key, code = key) {
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key, code })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code })
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
    if (message.method === 'Network.requestWillBeSent' && message.params.type === 'Image') imageRequests.add(message.params.request.url)
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failedResponses.push(message.params.response.url)
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
  if (processCheck) {
    await runProcessChecks({ send, evaluate, click, waitFor, screenshot, sectionScreenshot, keypress, delay, url, output })
    assert.equal(runtimeErrors.length, 0, 'No process-page runtime exceptions')
    assert.deepEqual(failedResponses, [], 'No failed process-page resources')
  } else if (servicesCheck) {
    await runServiceChecks({ send, evaluate, click, waitFor, screenshot, sectionScreenshot, checkImages, keypress, delay, url, output })
    assert.equal(runtimeErrors.length, 0, 'No service-page runtime exceptions')
    assert.deepEqual(failedResponses, [], 'No failed service-page resources')
  } else {
  for (const theme of ['dark', 'light']) {
    for (const width of [375, 768, 1024, 1440]) {
      const height = width === 375 ? 812 : width === 768 ? 1024 : 900
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }] })
      if (results.length) await evaluate('localStorage.clear(); sessionStorage.removeItem("sahil-motion-paused")')
      await send('Page.navigate', { url })
      await waitFor(() => evaluate('Boolean(document.querySelector(".eagle-canvas.is-ready"))'), '3D scene')
      await evaluate('document.fonts.ready.then(() => true)')
      await delay(2800) // Let the eagle assemble and the hero copy finish entering.
      await checkImages()
      const editorialImages = await evaluate(`({ hero: Boolean(document.querySelector('.hero > .section-photo img')?.naturalWidth), about: Boolean(document.querySelector('.about-photo img')?.naturalWidth), services: document.querySelectorAll('.service-row-art img').length, notes: document.querySelectorAll('.note-art img').length, contact: getComputedStyle(document.querySelector('.contact-photo')).display !== 'none' })`)
      assert.deepEqual(editorialImages, { hero: true, about: true, services: 2, notes: 5, contact: true }, 'Homepage editorial photography is present')
      const metrics = await evaluate(`({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', headings: document.querySelectorAll('h1').length, sections: document.querySelectorAll('main > section').length, canvas: document.querySelector('canvas').classList.contains('is-ready'), links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.getAttribute('href').slice(1))) })`)
      assert.ok(metrics.scrollWidth <= width, `Overflow at ${width} ${theme}`)
      assert.equal(metrics.theme, theme)
      assert.equal(metrics.headings, 1)
      assert.ok(metrics.links, 'Anchor destinations exist')
      assert.ok(metrics.canvas, '3D rendered')
      assert.ok(await evaluate(`(() => { const r = document.querySelector('.contact-aside').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth })()`), 'Contact copy stays in viewport')
      assert.ok(await evaluate(`(() => { const r = document.querySelector('.enquiry-form').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth })()`), 'Contact form stays in viewport')
      assert.ok(await evaluate(`(() => { const label = document.querySelector('.contact-topline .section-kicker'); return label.scrollWidth <= label.clientWidth })()`), 'Contact kicker does not clip')
      assert.equal(await evaluate('document.querySelector("h1").textContent'), 'The signature of success.')
      assert.ok(await evaluate(`['description', 'og:description', 'twitter:description'].every(name => document.querySelector('meta[name="'+name+'"],meta[property="'+name+'"]').content === document.querySelector('.hero-summary').textContent)`), 'Exact description metadata')
      assert.ok(await evaluate(`document.title.endsWith('The signature of success.') && document.querySelector('meta[property="og:title"]').content === document.title && document.querySelector('meta[name="twitter:title"]').content === document.title`), 'Exact title metadata')
      const heroSeparation = await evaluate(`(() => {
        const a = document.querySelector('.hero-copy').getBoundingClientRect();
        return ['.eagle-stage'].every(selector => {
          const b = document.querySelector(selector).getBoundingClientRect();
          return a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
        });
      })()`)
      assert.ok(heroSeparation, 'Hero copy is separated from eagle')
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
      await click('.motion-control')
      await waitFor(() => evaluate('document.querySelector(".motion-control").getAttribute("aria-pressed") === "true"'), 'motion pauses')
      assert.equal(await evaluate('document.querySelector(".motion-control").getAttribute("aria-pressed")'), 'true')
      await evaluate('scrollTo({top:0,behavior:"instant"})')
      await screenshot(`${theme}-${width}-hero`)
      // Trigger the real scroll reveals before section captures.
      for (const selector of ['#about', '.vision', '#services', '#process', '#explore', '#notes', '#contact', '.site-footer']) {
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant'})`)
        await delay(80)
      }
      await delay(1500)
      await evaluate('scrollTo({top:0,behavior:"instant"})')
      await screenshot(`${theme}-${width}`)
      for (const selector of ['#about', '.vision', '#services', '#process', '#explore', '#notes', '#contact', '.site-footer']) {
        await sectionScreenshot(selector, `${theme}-${width}-${selector.replace(/[.#]/g, '')}`)
      }
      const undersized = await evaluate(`([...document.querySelectorAll('a,button,input,select,textarea')].filter(el => {
        const r = el.getBoundingClientRect(); const style = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && (r.width < 44 || r.height < 44);
      }).map(el => ({ className: el.className, text: el.textContent.trim() })))`)
      assert.deepEqual(undersized, [], '44px control targets')
      const serviceIds = ['web','growth']
      for (const id of serviceIds) {
        await click('#tab-' + id)
        await waitFor(() => evaluate(`document.querySelector('#tab-${id}').getAttribute('aria-selected') === 'true'`), `service selection: ${id}`)
        await checkImages('.explorer-image')
        assert.ok(await evaluate('document.documentElement.scrollWidth') <= width, 'Service panel does not overflow')
        if (width === 375 || width === 1440) await sectionScreenshot('.explorer-panel', `${theme}-${width}-service-${id}`)
      }
      if (width === 375 || width === 1440) {
        for (let note = 1; note <= 5; note++) {
          await click(`.note-tile--${note} button`)
          await waitFor(() => evaluate('document.querySelector("dialog.reader").open'), 'article dialog')
          assert.equal(await evaluate('document.querySelector("dialog.reader").scrollTop'), 0, 'Article opens at the top')
          assert.equal(await evaluate('document.activeElement.className'), 'reader-close', 'Close control receives focus')
          await checkImages('.reader-image')
          await delay(400)
          await screenshot(`${theme}-${width}-article-${note}`)
          await click('.reader-close')
          await waitFor(() => evaluate('!document.querySelector("dialog.reader").open'), 'article closes')
        }
      }
      await evaluate('document.querySelector("#tab-web").focus()')
      await keypress('ArrowDown')
      assert.equal(await evaluate('document.activeElement.id'), 'tab-growth', 'Keyboard service navigation')
      assert.ok(await evaluate('document.activeElement.matches(":focus-visible") && getComputedStyle(document.activeElement).outlineStyle !== "none"'), 'Visible keyboard focus')
      results.push({ ...metrics, menu: width === 375 ? 'pass' : 'not applicable', pause: 'pass' })
      console.log(`${theme} ${width}: layout, anchors, 3D, pause${width === 375 ? ', menu and Escape' : ''} passed`)
    }
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  await waitFor(() => evaluate('Boolean(document.querySelector(".theme-toggle"))'), 'theme control')
  const beforeTheme = await evaluate('document.documentElement.classList.contains("dark")')
  await click('.theme-toggle')
  await waitFor(() => evaluate(`localStorage.getItem("sahil-theme") === ${JSON.stringify(beforeTheme ? 'light' : 'dark')}`), 'theme changes')
  await send('Page.reload')
  await waitFor(() => evaluate('Boolean(document.querySelector(".theme-toggle"))'), 'persisted theme')
  await delay(1200) // Next.js renders controls before their client handlers hydrate.
  assert.equal(await evaluate('document.documentElement.classList.contains("dark")'), !beforeTheme)

  // Choosing a service updates the panel and opens its detail page.
  await click('#tab-growth')
  await waitFor(() => evaluate('document.querySelector("#tab-growth").getAttribute("aria-selected") === "true"'), 'service tab selects')
  assert.match(await evaluate('document.querySelector(".explorer-tagline").textContent'), /growth|content|presence/i)
  assert.equal(await evaluate('new URL(document.querySelector(".explorer-start").href).pathname'), '/services/digital-growth')
  // Field notes open in a native dialog and close on Escape.
  await delay(1600) // let the smooth anchor scroll to #contact finish first
  await evaluate('scrollTo({top:0,behavior:"instant"})')
  await delay(300)
  await click('.note-tile--1 button')
  await waitFor(() => evaluate('document.querySelector("dialog.reader").open'), 'reader opens')
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await waitFor(() => evaluate('!document.querySelector("dialog.reader").open'), 'reader closes')
  assert.equal(await evaluate('document.querySelector("#faq")'), null, 'FAQ removed')
  await evaluate('document.querySelector("form").reset()')
  assert.equal(await evaluate('document.querySelector("form").checkValidity()'), false)
  await evaluate(`(() => { for (const [name,value] of Object.entries({name:'Test Business',email:'test@example.com',project:'A business website and marketing enquiry.'})) document.querySelector('[name="'+name+'"]').value=value; document.querySelector('[name="service"]').selectedIndex=1 })()`)
  assert.equal(await evaluate('document.querySelector("form").checkValidity()'), true)

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await evaluate('scrollTo({top:0,behavior:"instant"})')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".hero-copy h1")).animationName'), 'none')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".intro-sequence") || document.querySelector(".ambient-scene")).display'), 'none')
  await screenshot('reduced-motion')
  await evaluate('localStorage.clear()')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `const getContext = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type,...args) { return type === 'webgl2' ? null : getContext.call(this,type,...args) }` })
  await send('Page.reload')
  await waitFor(() => evaluate('Boolean(document.querySelector(".eagle-still"))'), 'WebGL fallback')
  await delay(300)
  assert.equal(await evaluate('document.querySelector(".eagle-canvas").classList.contains("is-ready")'), false)
  await screenshot('webgl-fallback')
  assert.equal(runtimeErrors.length, 0, 'No runtime exceptions')
  assert.deepEqual(failedResponses, [], 'No failed resource requests')
  assert.ok([...imageRequests].every(src => src.startsWith(url + '/')), 'All image requests are local')
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ results, runtimeErrors, failedResponses, localImageRequests: imageRequests.size, heroSeparation: 'pass', responsiveImages: 'pass', controlTargets: 'pass', keyboardTabs: 'pass', keyboardFocus: 'pass', themePersistence: 'pass', serviceExplorer: 'pass', reader: 'pass', faqRemoved: 'pass', formValidation: 'pass', reducedMotion: 'pass', webglFallback: 'pass' }, null, 2))
  console.log('Theme persistence, service explorer, reader dialog, FAQ removal, form validation, reduced motion, WebGL fallback, runtime errors: passed')
  console.log(`Screenshots: ${output}`)
  }
} finally {
  socket?.close()
  chrome.kill()
}
