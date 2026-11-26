import { env } from 'cloudflare:workers'

export type MailMessage = { kind: 'admin' | 'client' | 'code', enquiryId?: string, code?: string }

export type Bindings = {
  DB: D1Database
  MAIL_QUEUE: Queue<MailMessage>
  MAIL_ENABLED: string
  TURNSTILE_SECRET: string
  TURNSTILE_SITE_KEY: string
  ADMIN_JWT_SECRET: string
  SMTP_HOST: string
  SMTP_PORT: string
  SMTP_USER: string
  SMTP_PASSWORD: string
  SMTP_FROM: string
}

export function bindings() { return env as unknown as Bindings }
