# Shared Contracts

Use this directory only when a backend exists. It may contain framework-neutral
TypeScript request/response types and validation schemas shared by `src/` and
`server/`.

Do not place React components, API credentials, database clients, route
handlers, or Node-only code here. Keep shared modules small and dependency-light
so neither the frontend nor the backend accidentally imports the other.
