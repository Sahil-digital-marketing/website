# SAHIL Digital Marketing

Single-page marketing website built with React, TypeScript, Vite, and Tailwind CSS v4.3.

## Run locally

```sh
npm ci
npm run dev
```

`npm run typecheck` checks TypeScript. `npm run build` creates `dist/`;
`npm run preview` serves that production build locally.

## Homepage ownership

- `App.tsx` selects the page for the URL; `pages/LandingPage.tsx` composes sections.
- `src/components/` owns navigation, branding, controls, the form, the reader dialog, and the eagle presentation.
- `src/features/landing/` owns page sections and the particle eagle renderer.
- `src/data/landing.ts` owns services (with their detail), about copy, field notes, process, FAQs, and contact links.
- `src/lib/` owns the motion layer: Lenis smooth scroll driven by GSAP's ticker, scroll reveals, and the magnetic CTA.
- `src/styles.css` owns brand tokens, light/dark themes, responsive layout, and CSS motion.
- `public/brand/` holds the approved SAHIL logo (colour and one-colour), the eagle mark, favicons, and the share image.

## Design direction: Midnight Chrome

An editorial "printed annual" layout (12-column grid, an axis at about 42%, whole
sections in flat colour) on the Cobalt Horizon palette, with the logo's chrome
carried by the hero. Sora and Inter only. Square media, pill buttons, no
gradients, glass, hairlines, eyebrow labels, or shadows at rest.

The hero is the SAHIL eagle drawn by ~15,000 WebGL2 points sampled from the
logo mark, keeping its own chrome and blue. The points gather on load, part
around the pointer, and drift away as the hero scrolls. The renderer is loaded
separately, caps pixel density, pauses offscreen or when the tab is hidden, and
releases its graphics resources on unmount. Reduced motion shows the settled
eagle without travel; if WebGL fails, the logo mark itself is shown.

Motion dependencies: `gsap` (ScrollTrigger, SplitText; GSAP Standard License,
free for commercial use) and `lenis` (MIT). Everything is skipped under
`prefers-reduced-motion`.

## Content still needed

Enquiry delivery is not connected: native field validation and local review work,
but no form details are transmitted or saved. Field-note and contact photographs
are placeholder atmosphere from picsum.photos (Unsplash licence) and should be
replaced with the studio's own pictures. Contact details, "Udyam MSME" wording,
service deliverables (Website Development in particular), and field-note copy are
carried over from the current site and need founder confirmation. No portfolio
work, testimonials, or statistics have been invented.

## Browser checks

After building, run `npm run check:homepage` with Node 22+ and Chrome installed
(or set `CHROME_PATH` to Chrome/Chromium). The script launches an isolated
headless browser and serves the production build on a temporary local port.

It checks both themes at 375, 768, 1024, and 1440 pixels; anchor links, the
mobile menu and Escape, theme persistence, animation pause, FAQ expansion,
form validation, reduced motion, rendering fallback, and runtime exceptions.
Screenshots and the JSON report are written to ignored `.artifacts/homepage/`.
