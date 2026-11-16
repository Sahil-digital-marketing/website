# Optional Backend

No backend is initialized yet. Keep this directory until the project needs
server-side features such as authentication, private API integrations, a
database, or webhooks.

When that happens, create a separate backend package here rather than placing
server code in `src/`:

```text
server/
  src/routes/       HTTP endpoints
  src/services/     business logic and external integrations
  src/db/           database access and migrations
  src/middleware/   authentication, validation, rate limits
  tests/            backend tests
  .env.example      required variable names only
  package.json      backend-specific scripts and dependencies
```

The Vite frontend may call a backend only through a public
`VITE_API_BASE_URL` and client modules in `src/services/`. Never import backend
files into React, and never put secrets in a `VITE_` variable: Vite exposes them
to every browser user.
