# Enquiry backend

Next.js route handlers live in `app/api/`; server-only helpers, D1 schema and the
mail queue consumer live here. See [DEPLOYMENT.md](../DEPLOYMENT.md) for setup.

The form saves to D1 before acknowledging success. Both emails are queued and
retried by `mail-worker.ts`; `smtp.ts` sends them over a native Cloudflare TCP
socket with STARTTLS. The dashboard reads the delivery state from D1.
