# SAHIL Workers launch

The site is deployed at
`https://sahil-digital-marketing.sahil-digital-marketing.workers.dev`.
The D1 database, Queues, Turnstile widget, site secrets, and mail Worker are
provisioned. Enquiries and admin email-code requests are enabled. A live
enquiry was stored in D1, Gmail accepted its admin and client emails, and the
private admin API listed it after email-code sign-in. The user confirmed email
receipt. For a fresh deployment, keep enquiries
disabled until mail works; deploy with `MAIL_ENABLED=true` to open them.
Use Node 22.23+ or 24.22+ for the Cloudflare CLI.

## 1. Cloudflare resources

Sign in with `npx wrangler login`. Create the D1 database and queues in the
same Cloudflare account:

```powershell
npx wrangler d1 create sahil-enquiries
npx wrangler queues create sahil-mail
npx wrangler queues create sahil-mail-dead
```

Copy the D1 database ID from the first command into `server/wrangler.jsonc`
when recreating these resources in another account. This account's ID is
already configured.
`cloudflare.config.ts` binds the site Worker to the database and producer queue
by name. Deploy the schema before opening the form:

```powershell
npx wrangler d1 execute sahil-enquiries --remote --file=server/schema.sql --config server/wrangler.jsonc
```

The Turnstile widget for the `workers.dev` hostname has public site key
`0x4AAAAAAGUM7hLPvXFHyqcM`. It is configured in `cloudflare.config.ts`,
and its secret is stored on the site Worker as `TURNSTILE_SECRET`. The site
Worker also has a random `ADMIN_JWT_SECRET`. Do not commit either secret or
paste the SMTP password into chat.

## 2. Mail Worker

The `sahil-mail` Worker uses Gmail SMTP at `smtp.gmail.com:587` with sender
`ashenvi53@gmail.com`. Its `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_FROM`,
and `SMTP_PASSWORD` values are stored as Cloudflare secrets. Gmail app
passwords require two-step verification. If rotating the password, use the
Cloudflare dashboard or this local prompt:

```powershell
npx wrangler secret put SMTP_PASSWORD --name sahil-mail --config server/wrangler.jsonc
```

Deploy the consumer if its code has changed:

```powershell
npm run deploy:mail
```

The consumer retries failed messages up to eight times and sends exhausted
messages to `sahil-mail-dead`. The dashboard shows delivery failures; a failed
message should be inspected before retrying it from the dead-letter queue.

## 3. Site Worker

Build with the public site key and deploy the site:

```powershell
$env:TURNSTILE_SITE_KEY = 'YOUR_PUBLIC_SITE_KEY'
$env:MAIL_ENABLED = 'true'
npm run typecheck
npm run check:compat
npm run build
npm run deploy:vinext
```

`TURNSTILE_SECRET` and `ADMIN_JWT_SECRET` are already on the deployed
`sahil-digital-marketing` Worker. If rotating either value, set it through
Cloudflare's secret settings or `npx wrangler secret put <NAME> --name
sahil-digital-marketing`.
Leave `MAIL_ENABLED` false until `SMTP_PASSWORD` is set. The local `.dev.vars`
file is ignored; it is only for local testing. Apply
`server/schema.sql` to a local D1 instance before testing database routes.

## 4. Launch verification

Open every page at 375, 768, 1024 and 1440 pixels in both themes. Check form
validation, keyboard navigation, reduced motion, deep links and metadata.
Submit a real enquiry using the production Turnstile widget. Confirm the D1
record and its reference in `/admin`, then confirm the admin and client email
arrive. Check the two delivery states show `delivered`. Only then treat the
`workers.dev` deployment as launched.
