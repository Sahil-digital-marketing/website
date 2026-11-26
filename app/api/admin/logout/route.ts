import { clearSession, sameOrigin } from '../../../../server/security'
import { noStore } from '../../../../server/enquiries'

export const runtime = 'edge'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  await clearSession()
  return noStore({ ok: true })
}
