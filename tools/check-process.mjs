import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function runProcessChecks({ send, evaluate, click, waitFor, screenshot, sectionScreenshot, keypress, delay, url, output }) {
  const results = []

  for (const theme of ['light', 'dark']) {
    for (const width of [375, 768, 1024, 1440]) {
      const height = width === 375 ? 812 : width === 768 ? 1024 : 900
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }] })
      if (results.length) await evaluate('localStorage.clear()')
      await send('Page.navigate', { url: `${url}/process/` })
      await waitFor(() => evaluate('Boolean(document.querySelector("#process-page-title"))'), 'process page renders')
      await evaluate('document.fonts.ready.then(() => true)')

      const metrics = await evaluate(`({
        overflow: document.documentElement.scrollWidth > innerWidth,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        h1: document.querySelectorAll('h1').length,
        stages: document.querySelectorAll('.process-page-step').length,
        anchors: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))),
        undersized: [...document.querySelectorAll('a,button')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44) }).map(el => el.textContent.trim()),
        title: document.title
      })`)
      assert.equal(metrics.overflow, false, `${theme} ${width}: no horizontal overflow`)
      assert.equal(metrics.theme, theme)
      assert.equal(metrics.h1, 1)
      assert.equal(metrics.stages, 4)
      assert.equal(metrics.anchors, true)
      assert.deepEqual(metrics.undersized, [], `${theme} ${width}: 44px controls`)
      assert.equal(metrics.title, 'Our Process | SAHIL Digital Marketing')
      assert.equal(await evaluate('document.querySelector("meta[name=description]").content'), 'See how SAHIL Digital Marketing moves from discovery and an agreed plan to delivery, review and the next informed step.')
      await waitFor(() => evaluate('[...document.querySelectorAll(".main-nav a")].find(a => a.pathname === "/process")?.getAttribute("aria-current") === "page"'), 'active process navigation after hydration')
      assert.equal(await evaluate('document.querySelectorAll(".enquiry-form").length'), 1)

      await screenshot(`${theme}-${width}-hero`)
      await sectionScreenshot('.process-page-step', `${theme}-${width}-first-step`)
      if (width === 375 || width === 1440) {
        await evaluate('document.querySelector("#contact").scrollIntoView({ behavior: "instant" })')
        await delay(1000)
        assert.ok(await evaluate('getComputedStyle(document.querySelector(".contact-intro h2")).visibility === "visible"'), 'Contact content appears on scroll')
        await evaluate('document.querySelector(".enquiry-form").scrollIntoView({ behavior: "instant" })')
        await delay(1000)
        assert.ok(await evaluate('getComputedStyle(document.querySelector(".enquiry-form")).visibility === "visible"'), 'Enquiry form appears on scroll')
        await evaluate('scrollTo({ top: 0, behavior: "instant" })')
        await delay(200)
        await screenshot(`${theme}-${width}-full`, true)
      }

      if (width === 375) {
        await click('.menu-toggle')
        await waitFor(() => evaluate('Boolean(document.querySelector(".mobile-navigation-panel"))'), 'mobile menu opens')
        assert.equal(await evaluate('[...document.querySelectorAll(".mobile-navigation-panel a")].find(a => a.pathname === "/process")?.getAttribute("aria-current")'), 'page')
        await keypress('Escape')
        await waitFor(() => evaluate('!document.querySelector(".mobile-navigation-panel")'), 'mobile menu closes')
        assert.equal(await evaluate('document.activeElement.className'), 'menu-toggle')
      }
      results.push({ theme, width, ...metrics })
      console.log(`${theme} ${width}: process layout, metadata, navigation and controls passed`)
    }
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await evaluate('localStorage.clear()')
  await send('Page.navigate', { url: `${url}/process/` })
  await waitFor(() => evaluate('Boolean(document.querySelector(".process-page-cta"))'), 'process CTA renders')
  await click('.process-page-cta .button')
  await waitFor(() => evaluate('location.hash === "#contact"'), 'CTA reaches enquiry')
  assert.ok(await evaluate('document.querySelector("#contact").getBoundingClientRect().top < innerHeight'), 'Enquiry is visible')
  assert.ok(await evaluate('parseFloat(getComputedStyle(document.querySelector(".process-page-cta .button")).transitionDuration) <= 0.001'), 'Reduced motion removes transition')

  await send('Page.navigate', { url })
  await waitFor(() => evaluate('Boolean(document.querySelector("#process .text-link"))'), 'homepage process preview renders')
  assert.equal(await evaluate('document.querySelector("#process .text-link").getAttribute("href")'), '/process')
  assert.equal(await evaluate('[...document.querySelectorAll(".main-nav a")].find(a => a.pathname === "/process")?.getAttribute("href")'), '/process')

  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ results, enquiry: 'pass', homepageLink: 'pass', reducedMotion: 'pass' }, null, 2))
  console.log(`Process screenshots and results: ${output}`)
}
