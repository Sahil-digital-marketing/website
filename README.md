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
- `src/components/` owns navigation, branding, controls, the form, and the eagle presentation.
- `src/features/landing/` owns page sections and the eagle's geometry/rendering.
- `src/data/landing.ts` owns services, navigation destinations, process steps, and FAQs.
- `src/styles.css` owns brand tokens, light/dark themes, responsive layout, and CSS motion.

The hero uses an original faceted eagle sculpture, rendered with native WebGL2.
The renderer is loaded separately, caps pixel density, pauses offscreen or when
the tab is hidden, and releases its graphics resources on unmount. Reduced
motion produces a still scene. If WebGL fails, an owned SVG illustration is shown.
There are no added runtime dependencies or third-party UI components.

## Content still needed

The header uses a text wordmark pending the original approved logo. The eagle
is decorative artwork, not a replacement business logo. Enquiry delivery is not
connected: native field validation and local review work, but no form details
are transmitted or saved. Approved contact details, portfolio work, testimonials,
and backend integrations have not been invented.

## Browser checks

After building, run `npm run check:homepage` with Node 22+ and Chrome installed
(or set `CHROME_PATH` to Chrome/Chromium). The script launches an isolated
headless browser and serves the production build on a temporary local port.

It checks both themes at 375, 768, 1024, and 1440 pixels; anchor links, the
mobile menu and Escape, theme persistence, animation pause, FAQ expansion,
form validation, reduced motion, rendering fallback, and runtime exceptions.
Screenshots and the JSON report are written to ignored `.artifacts/homepage/`.
