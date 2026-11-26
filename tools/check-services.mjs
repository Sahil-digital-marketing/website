import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function runServiceChecks({ send, evaluate, click, waitFor, screenshot, sectionScreenshot, checkImages, keypress, delay, url, output }) {
  const results = []
  const routes = ['/services', '/services/website-development', '/services/digital-growth']
  async function navigate(route, selector) {
    await evaluate('window.__serviceCheckLeaving = true')
    await send('Page.navigate', { url: url + route })
    await waitFor(() => evaluate(`!window.__serviceCheckLeaving && (location.pathname.replace(/\\/+$/, '') || '/') === ${JSON.stringify(route.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/')} && Boolean(document.querySelector(${JSON.stringify(selector)}))`), 'new route document renders')
    await evaluate('document.fonts.ready')
  }
  for (const theme of ['light', 'dark']) {
    for (const width of [375, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 812 : 900, deviceScaleFactor: 1, mobile: false })
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'no-preference' }] })
      for (const route of routes) {
        if (results.length) await evaluate('localStorage.clear()')
        await navigate(route, route === routes[0] ? '#catalogue-title' : route === routes[1] ? '#website-page-title' : '#growth-page-title')
        await checkImages()
        assert.equal(await evaluate('document.querySelectorAll(".enquiry-form").length'), 1, 'One shared form on each page')
        assert.equal(await evaluate('document.querySelectorAll("[name=service] > option").length'), 3, 'Two services plus placeholder')
        const metrics = await evaluate(`({ overflow:document.documentElement.scrollWidth > innerWidth, theme:document.documentElement.classList.contains('dark')?'dark':'light', h1:document.querySelectorAll('h1').length, anchors:[...document.querySelectorAll('a[href^="#"]')].every(el=>document.getElementById(el.hash.slice(1))), undersized:[...document.querySelectorAll('a,button')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<44||r.height<44)}).map(el=>el.textContent.trim()), title:document.title })`)
        assert.equal(metrics.overflow, false, `${route} ${width}: no overflow`)
        assert.equal(metrics.theme, theme)
        assert.equal(metrics.h1, 1)
        assert.equal(metrics.anchors, true)
        assert.deepEqual(metrics.undersized, [], '44px controls')
        assert.ok(metrics.title.includes(route === routes[0] ? 'Our Services' : route === routes[1] ? 'Website Development' : 'Digital Growth'))
        assert.equal(await evaluate(`document.querySelector('meta[property="og:title"]').content`), metrics.title)
        await screenshot(`${theme}-${width}-${route === routes[0] ? 'overview' : route === routes[1] ? 'website' : 'growth'}-hero`)
        if (route === routes[0]) {
          assert.equal(await evaluate('document.querySelectorAll(".website-feature").length'), 2)
          assert.equal(await evaluate('document.querySelector(".service-catalogue > article").id'), 'web', 'Website development is listed first')
          await sectionScreenshot('.website-feature', `${theme}-${width}-website-feature`)
          await sectionScreenshot('.growth-feature', `${theme}-${width}-growth-feature`)
        } else if (route === routes[1]) {
          const prices = await evaluate('[...document.querySelectorAll(".package-price strong")].map(el=>el.textContent)')
          assert.deepEqual(prices, ['₹5,000','₹7,500','₹10,000','₹15,000','₹18,000','₹21,000','₹15,000','₹18,000','₹21,000'])
          assert.equal(await evaluate('document.querySelectorAll(".package-badge").length'), 3)
          for (const id of ['landing', 'business', 'ecommerce']) await sectionScreenshot('#' + id, `${theme}-${width}-${id}`)
          assert.ok(await evaluate('[...document.querySelectorAll(".pricing-note")].every(el=>parseFloat(getComputedStyle(el).fontSize)>=14 && getComputedStyle(el).visibility==="visible")'), 'Readable price qualification')
          await click('.website-type[href="#business"]')
          await waitFor(() => evaluate('location.hash === "#business"'), 'category jump')
        } else {
          assert.deepEqual(await evaluate('[...document.querySelectorAll(".growth-plan h3")].map(el=>el.textContent)'), ['Basic','Popular','Premium'])
          assert.deepEqual(await evaluate('[...document.querySelectorAll(".growth-plan .service-inclusions li")].map(el=>el.closest("article").id).reduce((counts,id)=>(counts[id]=(counts[id]||0)+1,counts),{})'), {basic:7,popular:8,premium:9})
          assert.equal(await evaluate('document.querySelectorAll(".growth-plan .package-price").length'), 0, 'Growth fees are not invented')
          await sectionScreenshot('.growth-plans', `${theme}-${width}-growth-plans`)
        }
        if (route === routes[1]) await sectionScreenshot('.custom-development', `${theme}-${width}-website-custom`)
        if (width === 375) {
          await click('.menu-toggle')
          await waitFor(() => evaluate('Boolean(document.querySelector(".mobile-navigation-panel"))'), 'mobile menu opens')
          await keypress('Escape')
          await waitFor(() => evaluate('!document.querySelector(".mobile-navigation-panel")'), 'mobile menu dismisses')
        }
        results.push({ theme, width, route, ...metrics })
      }
      console.log(`${theme} ${width}: three service routes, layout, prices, links and controls passed`)
    }
  }

  await send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false })
  await send('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] })
  await navigate('/services/website-development', '.package-card')
  const enquiries = await evaluate('[...document.querySelectorAll(".package-card .button")].map(el=>({href:el.getAttribute("href"),id:el.closest("article").dataset.package,price:el.closest("article").querySelector(".package-price strong").textContent}))')
  for (const item of enquiries) {
    await navigate('/services/website-development', '.package-card')
    await click(`[data-package="${item.id}"] .button`)
    await waitFor(() => evaluate(`Boolean(document.querySelector('.selected-package input[value="${item.id}"]'))`), 'package selected in form')
    assert.equal(await evaluate('document.querySelector("[name=service]").value'), 'web')
    assert.ok((await evaluate('document.querySelector(".selected-package").textContent')).includes(item.price))
    await waitFor(() => evaluate('document.querySelector("#contact").getBoundingClientRect().top < innerHeight'), 'Contact destination visible after smooth scrolling')
  }
  await screenshot('selected-package')
  await evaluate(`document.querySelector('[name=name]').value='Reusable Form Check'`)
  await evaluate(`(() => {const select=document.querySelector('[name=website-package]'); select.value='landing-standard'; select.dispatchEvent(new Event('change',{bubbles:true}));})()`)
  await waitFor(() => evaluate(`document.querySelector('input[name=package]')?.value==='landing-standard'`), 'Package selector updates price')
  assert.ok((await evaluate('document.querySelector(".selected-package").textContent')).includes('₹7,500'))
  assert.equal(await evaluate(`document.querySelector('[name=name]').value`), 'Reusable Form Check', 'Package changes preserve entered details')
  await evaluate(`(() => { const select=document.querySelector('[name=website-package]');select.value='custom-development';select.dispatchEvent(new Event('change',{bubbles:true})); })()`)
  await waitFor(() => evaluate('Boolean(document.querySelector(".custom-enquiry")) && document.querySelector("input[name=package]")?.value === "custom-development"'), 'Custom development is a website option')
  assert.ok((await evaluate('document.querySelector("[name=project]").placeholder')).includes('billing software'))
  await screenshot('custom-quote-enquiry')
  await navigate('/services/digital-growth', '.growth-plan')
  for (const tier of ['Basic', 'Popular', 'Premium']) {
    const href = await evaluate(`document.querySelector('#${tier.toLowerCase()} .growth-plan-foot a').href`)
    assert.equal(new URL(href).hostname, 'wa.me')
    assert.equal(new URL(href).pathname, '/917676974316')
    assert.ok(new URL(href).searchParams.get('text').includes(`${tier} Digital Growth monthly plan`))
  }
  assert.equal(await evaluate('document.querySelector("[name=service] option[value=growth]").textContent'), 'Digital Growth')
  for (const [query, expectedService, expectedPackage] of [
    ['service=web&package=unknown', 'web', null],
    ['service=unknown&package=landing-basic', '', null],
    ['service=growth&package=landing-basic', 'growth', null],
    ['service=custom&package=landing-basic', 'web', 'custom-development'],
  ]) {
    await navigate('/?' + query + '#contact', '.enquiry-form')
    await waitFor(() => evaluate(`document.querySelector('[name=service]').value === ${JSON.stringify(expectedService)} && (document.querySelector('input[name=package]')?.value ?? null) === ${JSON.stringify(expectedPackage)}`), 'query prefills form after hydration')
    assert.equal(await evaluate('document.querySelector("[name=service]").value'), expectedService)
    assert.equal(await evaluate('document.querySelector("input[name=package]")?.value ?? null'), expectedPackage)
  }
  for (const route of routes) {
    await navigate(route + '/', '.service-page')
    await send('Page.reload')
    await waitFor(() => evaluate('Boolean(document.querySelector(".service-page"))'), 'refresh trailing slash')
    const html = await (await fetch(url + route)).text()
    assert.ok(html.includes(route === routes[0] ? '<title>Our Services' : route === routes[1] ? '<title>Website Development &amp; Packages' : '<title>Digital Growth'), 'Static HTML has route metadata')
  }
  await click('.brand')
  await waitFor(() => evaluate('Boolean(document.querySelector(".hero"))'), 'Logo returns home')
  await navigate('/services', '.service-page')
  await delay(800)
  await click('.theme-toggle')
  const chosen = await evaluate('localStorage.getItem("sahil-theme")')
  await send('Page.reload')
  await waitFor(() => evaluate('Boolean(document.querySelector(".theme-toggle"))'), 'theme persistence')
  assert.equal(await evaluate('document.documentElement.classList.contains("dark")'), chosen === 'dark')
  await send('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] })
  await evaluate('document.querySelector(".skip-link").focus()')
  await keypress('Tab')
  assert.ok(await evaluate('document.activeElement.matches(":focus-visible") && getComputedStyle(document.activeElement).outlineStyle!=="none"'), 'Keyboard focus visible')
  await fs.writeFile(path.join(output,'results.json'),JSON.stringify({results,packageEnquiries:enquiries.length,customDevelopment:'pass',growthQuotes:'pass',websiteFirst:'pass',invalidSelections:'pass',themePersistence:'pass',deepLinks:'pass',staticMetadata:'pass',keyboardFocus:'pass'},null,2))
  console.log('Website packages, Digital Growth quotes, invalid selections, deep links, metadata, theme persistence and keyboard focus passed')
}
