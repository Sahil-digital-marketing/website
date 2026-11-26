import { bindings } from '../../../../server/bindings'
import { db, noStore, value } from '../../../../server/enquiries'
import { clientAddress, digest, issueSession, limited, sameOrigin } from '../../../../server/security'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  try {
    const ip = await digest(clientAddress(request))
    if (await limited(`verify:${ip}`, 10, 900)) return noStore({ error: 'Too many attempts. Try again later.' }, 429)
    const data = await request.json() as { code?: unknown }
    const code = value(data.code, 6, true)
    const jar = await cookies()
    const id = jar.get('sahil_code_id')?.value
    if (!id || !code || !/^[0-9a-f-]{36}$/i.test(id) || !/^\d{6}$/.test(code)) return noStore({ error: 'Invalid or expired code.' }, 400)
    const row = await db().prepare('SELECT * FROM admin_codes WHERE id = ?').bind(id).first<{ code_hash: string, expires_at: number, attempts: number, consumed_at: number | null }>()
    if (!row || row.expires_at < Date.now() || row.attempts >= 5 || row.consumed_at !== null) return noStore({ error: 'Invalid or expired code.' }, 400)
    await db().prepare('UPDATE admin_codes SET attempts = attempts + 1 WHERE id = ?').bind(id).run()
    if (await digest(`${id}:${code}:${bindings().ADMIN_JWT_SECRET}`) !== row.code_hash) return noStore({ error: 'Invalid or expired code.' }, 400)
    const consumed = await db().prepare('UPDATE admin_codes SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL AND expires_at > ? AND attempts <= 5').bind(Date.now(), id, Date.now()).run()
    if (!consumed.meta.changes) return noStore({ error: 'Invalid or expired code.' }, 400)
    jar.delete('sahil_code_id')
    await issueSession(request)
    return noStore({ ok: true })
  } catch {
    return noStore({ error: 'Sign-in is temporarily unavailable.' }, 503)
  }
}
