# Repository Guidelines

## Project Structure and Boundaries

React + Vite + TypeScript frontend. `src/` is browser-only:
`main.tsx` mounts the app, `App.tsx` composes it, and `styles.css` owns Tailwind
tokens. Put UI in `src/components/`, screen work in `src/features/`, browser
API clients in `src/services/`, utilities in `src/lib/`, and static files in
`public/`.

There is no backend yet. If needed, create a separate `server/` package with
routes, services, database access, and tests. Frontend files never import
`server/`. Use `shared/` only for framework-neutral contracts and schemas—never
secrets, database access, or server implementation. Keep `.github/CODEOWNERS`.

## Environments and Secrets

Vite loads `.env.development` and `.env.production`. Keep public defaults in
`.env.example` and overrides in ignored `.env.local`. `VITE_` values are public;
production secrets belong in hosting or untracked `server/.env`.

## Coding Rules

- Write clean, simple, readable code that follows the existing style and
  two-space formatting.
- Choose meaningful names; keep functions small and responsible for one task.
- Reuse existing code and shared utilities; do not duplicate logic or introduce
  complexity without a clear need.
- Add comments only for non-obvious decisions, not to restate the code.
- Remove unused imports, variables, and dead code in files you touch.
- Change only what the task requires; keep every change easy to maintain.

## Dependency Policy

Own UI in `src/`; do not import third-party UI component or design-system
packages. Approved foundations are React, Vite, Tailwind, and Fontsource. Add
any dependency only after checking maintenance, security, licence, bundle cost,
and a practical fallback.

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

Run `npm run dev`, `npm run typecheck`, `npm run build`, and `npm run preview`.
Test 375px, 768px, 1024px, and 1440px in both themes; check keyboard flow,
overflow, reduced motion, and errors. Include theme screenshots in pull
requests. Never commit credentials.
