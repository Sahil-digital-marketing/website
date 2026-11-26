import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { bindings } from './bindings'
import { db } from './enquiries'

const cookieName = 'sahil_admin'
const adminEmail = 'akashshenvi93@gmail.com'

function secret() {
  const value = bindings().ADMIN_JWT_SECRET
  if (!value || value.length < 32) throw new Error('ADMIN_JWT_SECRET must be at least 32 characters')
  return new TextEncoder().encode(value)
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return Boolean(origin && origin === new URL(request.url).origin)
}

export function clientAddress(request: Request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function digest(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function limited(key: string, max: number, windowSeconds: number) {
  const now = Math.floor(Date.now() / 1000)
  const start = now - windowSeconds
  await db().prepare(`INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      count = CASE WHEN window_start < ? THEN 1 ELSE count + 1 END,
      window_start = CASE WHEN window_start < ? THEN excluded.window_start ELSE window_start END`)
    .bind(key, now, start, start).run()
  const row = await db().prepare('SELECT count FROM rate_limits WHERE key = ?').bind(key).first<{ count: number }>()
  return (row?.count || 0) > max
}

export async function issueSession(request: Request) {
  const token = await new SignJWT({ email: adminEmail })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(adminEmail)
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret())
  const jar = await cookies()
  jar.set(cookieName, token, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', path: '/', maxAge: 1800 })
}

export async function isAdmin() {
  try {
    const token = (await cookies()).get(cookieName)?.value
    if (!token) return false
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'], subject: adminEmail })
    return payload.email === adminEmail
  } catch { return false }
}

export async function clearSession() {
  (await cookies()).delete(cookieName)
}
