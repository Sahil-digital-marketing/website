import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { SignJWT } from 'jose'

const base = process.env.SAHIL_BASE_URL || 'http://127.0.0.1:4173'
const secrets = await fs.readFile('.dev.vars', 'utf8')
const jwtSecret = secrets.match(/^ADMIN_JWT_SECRET=(.+)$/m)?.[1]?.trim()
assert.ok(jwtSecret, 'Set ADMIN_JWT_SECRET in .dev.vars before running this local check')
const key = new TextEncoder().encode(jwtSecret)

async function token(expiresAt) {
  return new SignJWT({ email: 'akashshenvi93@gmail.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('akashshenvi93@gmail.com')
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key)
}

const expired = await token(Math.floor(Date.now() / 1000) - 60)
const current = await token(Math.floor(Date.now() / 1000) + 600)
const id = crypto.randomUUID()
const cases = [
  ['unauthenticated list', '/api/admin/enquiries', 'GET', {}, 401],
  ['expired session', '/api/admin/enquiries', 'GET', { Cookie: `sahil_admin=${expired}` }, 401],
  ['unauthenticated delete', `/api/admin/enquiries/${id}`, 'DELETE', { Origin: base }, 401],
  ['cross-origin status change', `/api/admin/enquiries/${id}`, 'PATCH', { Cookie: `sahil_admin=${current}`, Origin: 'https://invalid.example', 'Content-Type': 'application/json' }, 403, '{"status":"closed"}'],
  ['invalid status', `/api/admin/enquiries/${id}`, 'PATCH', { Cookie: `sahil_admin=${current}`, Origin: base, 'Content-Type': 'application/json' }, 400, '{"status":"invalid"}'],
]

for (const [label, path, method, headers, expected, body] of cases) {
  const response = await fetch(base + path, { method, headers, body })
  assert.equal(response.status, expected, label)
  console.log(`${label}: ${response.status}`)
}
