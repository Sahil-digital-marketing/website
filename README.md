# SAHIL Digital Marketing

Next.js App Router and vinext marketing site on Cloudflare Workers, with TypeScript and Tailwind CSS v4.3.

## Run locally

Use Node 22.23+ or 24.22+ for the Cloudflare Vite plugin.

```sh
npm ci
npm run dev
```

For a production preview, run `npm run build` and then `npm run preview`. Local Worker secrets belong in ignored `.dev.vars`. Apply `server/schema.sql` to the local D1 database before testing form delivery or authenticated admin actions.

Production builds enable enquiry and admin-code mail by default. `MAIL_ENABLED=false` pauses both paths; local development defaults to disabled. Delivery requires the `sahil-mail` queue consumer, its SMTP secrets, the D1 database and Turnstile bindings. Set `MAIL_ENABLED` explicitly for a one-off build only when changing this behavior intentionally.

## Site structure

- `app/` owns the eight page routes, metadata, and API route handlers.
- `src/screens/` and `src/features/landing/` own public page content and sections.
- `src/components/` owns navigation, the theme and motion controls, enquiry form, dialogs, and visual scenes.
- `src/data/` owns the two current service offers, packages, field notes, and contact information.
- `src/styles.css` retains the base and responsive rules; `src/reference-theme.css` applies the supplied blue and cyan design across every route.
- `server/` owns D1 enquiries, authentication, and queued mail delivery. Public pages use the existing `/api/enquiries` endpoint.

## Design and motion

The supplied `docs/index (1).html` is the visual reference. The site uses locally served Poppins headings and Inter body text, a dark blue and cyan mode, and a paired light mode. The homepage includes a skippable first-visit intro, WebGL eagle, scroll progress, orbit and network scenes, a horizontal desktop process sequence, service artwork, and filterable field notes. Other pages share the visual system and use lighter entrance motion. Decorative motion can be paused; reduced-motion visitors see static content and the eagle fallback.

The current Website Development and Digital Growth offers, package prices, enquiry selection, and admin workflow remain the source of truth. The reference's illustrative performance numbers and Supabase form are not used as business claims or integrations. Sample team profiles and address information on the About page are still labelled as samples; approved real material should replace them before publication.

## Checks

Run `npm run typecheck`, `npm run check:compat`, `npm run build`, `npm run preview`, and the `check:homepage`, `check:services`, `check:process`, `check:routes`, and `check:security` scripts. Browser checks need Chrome and write screenshots and results to ignored `.artifacts/` folders. They cover both themes at 375, 768, 1024, and 1440 pixels, plus navigation, forms, keyboard focus, reduced motion, and rendering fallbacks.
