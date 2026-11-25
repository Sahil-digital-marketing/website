# Homepage imagery verification

Verified locally on 2026-11-18 with Chrome against the production Vite build.

- `npm run typecheck`, `npm run build`, and `npm run check:homepage` passed.
- Started the development server and production preview; the preview page and a local WebP returned HTTP 200.
- Captured fresh viewport and section screenshots at 375, 768, 1024 and 1440px in light and dark themes. Fixed-size captures preserve viewport-dependent layouts.
- Checked all six service tabs at every viewport/theme combination. Captured each service panel and all five article dialogs at phone and desktop widths in both themes.
- Verified local image requests, successful image decoding, responsive sources, intrinsic dimensions, exact headline/metadata, hero separation, no horizontal overflow, 44px controls and visible keyboard focus.
- Verified theme persistence, mobile menu Escape dismissal, arrow-key service navigation, service-to-form selection, article opening position/close focus, article dismissal, form validation and the existing preview-only submission behavior. The FAQ and its navigation link have been removed.
- Verified motion pause, reduced motion, the WebGL fallback and zero runtime exceptions or failed resource responses.
- Audited rendered page text contrast in both themes, including a conservative bright-pixel bound for the blue photo blends. Default text passed; white text on the dark-theme button hover is 4.52:1.

Machine results and fresh screenshots: `.artifacts/homepage/results.json` and `.artifacts/homepage/*.png` (local, ignored artifacts). The automated checks live in `tools/check-homepage.mjs`.

The seven replacement generated photographs have three WebP variants each (480, 960 and 1536px wide). They use distinct documentary subjects and replace the original matching desk scenes. Stock downloads were unavailable in the session; these remain generated illustrative scenes. Final assets are in `public/images/home/`; generation prompts are in `docs/home-photography-prompts.json`. Original generation files are retained in the local `.artifacts/imagegen/` directory.

The service explorer now uses parallel columns for inclusions and the image/workflow/next action, with smaller spacing and a compact mobile layout. The services introduction retains its split layout with a large photo filling the left panel. The contact introduction, workshop photo and direct contact links fill the left side beside the form. Form controls have full visible borders, readable placeholders and explicit keyboard focus outlines.

No deployment or backend changes were made. The enquiry form remains a clearly labeled preview and does not send or store enquiries.
