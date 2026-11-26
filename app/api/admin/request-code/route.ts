import { bindings } from '../../../../server/bindings'
import { db, noStore, value } from '../../../../server/enquiries'
import { clientAddress, digest, limited, sameOrigin } from '../../../../server/security'
import { cookies } from 'next/headers'

export const runtime = 'edge'
const adminEmail = 'akashshenvi93@gmail.com'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  if (bindings().MAIL_ENABLED !== 'true') return noStore({ error: 'Admin sign-in is temporarily unavailable. Please try again shortly.' }, 503)
  try {
    const data = await request.json() as { email?: unknown }
    const email = value(data.email, 254, true)?.toLowerCase()
    const ip = await digest(clientAddress(request))
    if (await limited(`code:${ip}`, 5, 3600)) return noStore({ error: 'Too many attempts. Try again later.' }, 429)
    if (email !== adminEmail) return noStore({ message: 'If this address is authorized, a code will arrive shortly.' })
    const digits = new Uint32Array(1)
    crypto.getRandomValues(digits)
    const code = String(digits[0] % 1000000).padStart(6, '0')
    const id = crypto.randomUUID()
    const hash = await digest(`${id}:${code}:${bindings().ADMIN_JWT_SECRET}`)
    await db().prepare('DELETE FROM admin_codes').run()
    await db().prepare('INSERT INTO admin_codes (id, code_hash, expires_at) VALUES (?, ?, ?)').bind(id, hash, Date.now() + 600000).run()
    await bindings().MAIL_QUEUE.send({ kind: 'code', code })
    ;(await cookies()).set('sahil_code_id', id, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', path: '/api/admin', maxAge: 600 })
    return noStore({ message: 'If this address is authorized, a code will arrive shortly.' })
  } catch {
    return noStore({ error: 'Could not send a sign-in code. Try again shortly.' }, 503)
  }
}
