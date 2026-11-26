import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const base = process.env.SAHIL_BASE_URL || 'http://127.0.0.1:4173'
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'sahil-routes-'))
const output = path.resolve('.artifacts/routes')
await fs.mkdir(output, { recursive: true })
const chrome = spawn(chromePath, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
let nextId = 0
const pending = new Map()
const errors = []

async function waitFor(check, label) {
  for (let attempt = 0; attempt < 200; attempt++) {
    try { const value = await check(); if (value) return value } catch { /* Browser is loading. */ }
    await delay(100)
  }
  throw new Error(`Timed out: ${label}`)
}

function send(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 30000)
    pending.set(id, { resolve, reject, timeout })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

const routes = ['/', '/about', '/services', '/services/website-development', '/services/digital-growth', '/process', '/privacy', '/admin']
try {
  const portFile = await waitFor(() => fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8'), 'Chrome startup')
  const port = Number(portFile.split('\n')[0])
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl)
  await once(socket, 'open')
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
    const callback = pending.get(message.id)
    if (!callback) return
    clearTimeout(callback.timeout)
    pending.delete(message.id)
    if (message.error) callback.reject(new Error(message.error.message))
    else callback.resolve(message.result)
  })
  await send('Page.enable')
  await send('Runtime.enable')
  for (const theme of ['light', 'dark']) {
    for (const width of [375, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 812 : 900, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] })
      for (const route of routes) {
        if (await evaluate('location.origin !== "null"')) await evaluate('localStorage.removeItem("sahil-theme")')
        await send('Page.navigate', { url: base + route })
        await waitFor(() => evaluate('document.readyState !== "loading" && Boolean(document.querySelector("h1"))'), `${route} at ${width}`)
        await delay(200)
        const state = await evaluate(`({ width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, title: document.title, description: document.querySelector('meta[name="description"]')?.content, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', h1: document.querySelectorAll('h1').length })`)
        assert.equal(state.width, width, `${route} viewport`)
        assert.ok(state.overflow <= 0, `${route} overflow ${state.overflow}px at ${width} ${theme}`)
        assert.equal(state.theme, theme, `${route} theme`)
        assert.equal(state.h1, 1, `${route} heading`)
        assert.ok(state.title && state.description, `${route} metadata`)
        if ((route === '/admin' || route === '/privacy') && (width === 375 || width === 1440)) {
          const shot = await send('Page.captureScreenshot', { format: 'png' })
          await fs.writeFile(path.join(output, `${route.slice(1)}-${theme}-${width}.png`), Buffer.from(shot.data, 'base64'))
        }
      }
      console.log(`${theme} ${width}: ${routes.length} routes passed`)
    }
  }
  assert.deepEqual(errors, [], 'No runtime exceptions')
  console.log(`Screenshots: ${output}`)
} finally {
  socket?.close()
  chrome.kill()
  try { await fs.rm(profile, { recursive: true, force: true }) } catch { /* Chrome may still be closing on Windows. */ }
}
