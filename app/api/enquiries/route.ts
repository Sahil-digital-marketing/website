import { services } from '../../../src/data/landing'
import { customDevelopment } from '../../../src/data/customDevelopment'
import { findWebsitePackage } from '../../../src/data/websitePackages'
import { bindings } from '../../../server/bindings'
import { db, noStore, value } from '../../../server/enquiries'
import { clientAddress, digest, limited, sameOrigin } from '../../../server/security'

export const runtime = 'edge'

type Payload = Record<string, unknown>

async function verified(token: string, request: Request) {
  const secret = bindings().TURNSTILE_SECRET
  if (!secret) return false
  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: clientAddress(request) }),
      signal: AbortSignal.timeout(10000),
    })
    if (!result.ok) return false
    const data = await result.json() as { success?: boolean, hostname?: string, action?: string }
    const hostname = new URL(request.url).hostname
    const localTest = (hostname === 'localhost' || hostname === '127.0.0.1') && secret === '1x0000000000000000000000000000000AA' && data.hostname === 'example.com'
    return data.success === true && (data.action === 'enquiry' || localTest) && (data.hostname === hostname || localTest)
  } catch (error) {
    console.error('Turnstile verification failed', error)
    return false
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  if (bindings().MAIL_ENABLED !== 'true') return noStore({ error: 'Enquiries are temporarily unavailable. Please try again shortly.' }, 503)
  let submissionKey = ''
  try {
    const raw = await request.text()
    if (raw.length > 16000) return noStore({ error: 'Your message is too long.' }, 413)
    const data = JSON.parse(raw) as Payload
    const key = value(data.submissionKey, 36, true)
    if (!key || !/^[0-9a-f-]{36}$/i.test(key)) return noStore({ error: 'Please refresh the form and try again.' }, 400)
    submissionKey = key

    const existing = await db().prepare('SELECT id FROM enquiries WHERE submission_key = ?').bind(key).first<{ id: string }>()
    if (existing) return noStore({ reference: existing.id })

    const addressKey = await digest(clientAddress(request))
    if (await limited(`enquiry:${addressKey}`, 6, 3600)) return noStore({ error: 'Too many enquiries. Please try again later.' }, 429)

    const service = value(data.service, 60, true)
    const packageId = value(data.packageId, 80)
    const name = value(data.name, 100, true)
    const email = value(data.email, 254, true)
    const project = value(data.project, 5000, true, true)
    const company = value(data.company, 150)
    const phone = value(data.phone, 30)
    const budget = value(data.budget, 100)
    const timeline = value(data.timeline, 100)
    const token = value(data.turnstileToken, 2048, true)
    if (!service || !services.some(item => item.id === service) || !name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !project || company === null || phone === null || budget === null || timeline === null || packageId === null || !token || (packageId && (service !== 'web' || packageId !== customDevelopment.packageId && !findWebsitePackage(packageId)))) {
      return noStore({ error: 'Please check the form fields and try again.' }, 400)
    }
    if (!await verified(token, request)) return noStore({ error: 'Security check failed. Please complete it again.' }, 400)

    const id = crypto.randomUUID()
    await db().prepare(`INSERT INTO enquiries
      (id, submission_key, created_at, service, package_id, name, email, company, phone, project, budget, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, key, new Date().toISOString(), service, packageId || null, name, email.toLowerCase(), company || null, phone || null, project, budget || null, timeline || null).run()

    for (const kind of ['admin', 'client'] as const) {
      try {
        await bindings().MAIL_QUEUE.send({ kind, enquiryId: id })
      } catch {
        await db().prepare(`UPDATE enquiries SET ${kind}_email_state = 'failed', ${kind}_email_error = 'Could not queue email' WHERE id = ?`).bind(id).run()
      }
    }
    return noStore({ reference: id }, 201)
  } catch {
    if (submissionKey) {
      try {
        const saved = await db().prepare('SELECT id FROM enquiries WHERE submission_key = ?').bind(submissionKey).first<{ id: string }>()
        if (saved) return noStore({ reference: saved.id })
      } catch { /* The database is unavailable. */ }
    }
    return noStore({ error: 'We could not save your enquiry. Please try again.' }, 503)
  }
}
