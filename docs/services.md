# Services pages

The public offer has two main services:

- `/services/website-development` compares Landing Page, Business Website, and E-commerce packages from the supplied `Price Sheet.pdf`. Custom websites, software, and applications are offered within Website Development and quoted after a requirements review.
- `/services/digital-growth` compares Basic, Popular, and Premium monthly plans transcribed from the supplied Digital Growth graphic. Each plan lists its inclusions without a published price. Google Ads budget is charged separately.

`/services` introduces both services. The homepage service section, explorer, footer, and form selector use the same two-service list from `src/data/landing.ts`. Field Notes remain educational content.

Website prices and inclusions live in `src/data/websitePackages.ts`. All published prices are starting prices, with a complexity qualification. The reusable enquiry form can preselect one of the nine website packages or a custom development project. A legacy `?service=custom` link selects Website Development and the custom option.

Digital Growth inclusions and WhatsApp links live in `src/data/growthPackages.ts`. Each plan's quote button opens WhatsApp with the selected tier in the message. The shared form posts to `/api/enquiries`, which verifies Turnstile and saves the enquiry in D1 when the local or production bindings are configured. No monthly Growth fee is invented.

The production build emits route-specific HTML and metadata for both detail pages. Direct URLs and trailing slashes work on static servers with directory-index support.

Run `npm run typecheck`, `npm run build`, `npm run check:services`, and `npm run check:homepage`. The browser checks require Node 22+ and Chrome (or `CHROME_PATH`). Screenshots and results go to `.artifacts/services/` and `.artifacts/homepage/`.
