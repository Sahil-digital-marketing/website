import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "sahil-digital-marketing",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-25",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      DB: bindings.d1({ name: "sahil-enquiries" }),
      MAIL_QUEUE: bindings.queue({ name: "sahil-mail" }),
      MAIL_ENABLED: bindings.text(process.env.MAIL_ENABLED ?? (process.env.NODE_ENV === "production" ? "true" : "false")),
      TURNSTILE_SITE_KEY: bindings.text(process.env.TURNSTILE_SITE_KEY || "0x4AAAAAAGUM7hLPvXFHyqcM"),
      TURNSTILE_SECRET: bindings.secret(),
      ADMIN_JWT_SECRET: bindings.secret(),
    },
  }),
});
