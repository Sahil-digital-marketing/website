<!-- akash-frontend-library:start -->
## Akash's design and frontend library

Before every coding task, read the router at
`D:/Coading/Development/Skills/plugins/akash-frontend-library/skills/madetoscale-top15/SKILL.md`.
For interface work, use UI/UX Pro Max, Taste, Apple Design and local frontend
guidance, then the relevant React, review, branding, diagram, slide, audio,
Stitch or creative-web specialists. Preserve the brief and this design system.
Keep backend-only tasks free of UI dependencies.
<!-- akash-frontend-library:end -->

# Repository Guidelines

## Project Structure and Boundaries

Next.js App Router + vinext + TypeScript on Cloudflare Workers. `app/` owns
routes, metadata, layouts and route handlers. `src/` owns client components,
screens, visual content, browser utilities and `styles.css` Tailwind tokens.
`server/` owns D1 access, authentication and queued mail delivery. Frontend
files never import server implementation; put shared types in `shared/`.
Static assets stay in `public/`. Keep `.github/CODEOWNERS`.

## Environments and Secrets

Keep public defaults in `.env.example`. Local Worker secrets go in ignored
`.dev.vars`; production secrets are Cloudflare Worker secrets. The Turnstile
site key is public and read from `TURNSTILE_SITE_KEY` during build. Never put
SMTP credentials, Turnstile secret or JWT secret in client code or Git.

## Coding Rules

- Write clean, simple, readable code that follows the existing style and two-space formatting.
- Choose meaningful names; keep functions small and responsible for one task.
- Reuse existing code and shared utilities; do not duplicate logic without a clear need.
- Add comments only for non-obvious decisions, not to restate the code.
- Remove unused imports, variables, and dead code in files you touch.
- Change only what the task requires; keep every change easy to maintain.

## Dependency Policy

Own UI in `src/`; do not import third-party UI component or design-system
packages. Approved foundations are React, Next.js, vinext, Vite, Tailwind,
and Fontsource. Check maintenance, security, licence, bundle cost, and a
practical fallback before adding a dependency.

## Astryx Design Workflow

For substantial UI, use the supplied [Astryx study](C:/Users/Akash/Downloads/Astryx-Study-and-Audit-2026-11-14.md).
If available, use `astryx search "<task>"` then `astryx component <Name>
--dense`. It is guidance only: do not add StyleX or migrate without approval.

## Visual System

Use Cobalt Horizon: `#000521`, `#020C47`, `#011F65`, `#0E4EB2`, and
`#2078CF`; light uses `#F5F8FF`, `#FFFFFF`, `#071B45`, `#425982`, and
`#C7D6F4`. Use semantic variables, 4.5:1 contrast, Sora headings, Inter body,
and Orbitron labels. Respect reduced motion; controls need focus and 44px targets.

## Tailwind & Themes

Tailwind v4.3 uses the Vite plugin. Keep `@import "tailwindcss";`, class-based
`dark`, and `@theme inline` in `src/styles.css`. Avoid legacy Tailwind/PostCSS
configuration; preserve `.dark` and system preference.

## Commands and Quality

Run `npm run dev`, `npm run typecheck`, `npm run check:compat`, `npm run build`,
and `npm run preview`. Node 22.23+ or 24.22+ is needed for the Cloudflare CLI.
Apply `server/schema.sql` to D1 before testing forms or admin routes.
Test 375px, 768px, 1024px, and 1440px in both themes; check keyboard flow,
overflow, reduced motion, and errors. Include theme screenshots in pull
requests. Never commit credentials.
