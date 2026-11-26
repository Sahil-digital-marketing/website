import { db, findById, noStore } from '../../../../../server/enquiries'
import { isAdmin, sameOrigin } from '../../../../../server/security'

export const runtime = 'edge'

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: Context) {
  if (!await isAdmin()) return noStore({ error: 'Unauthorized.' }, 401)
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  const { id } = await context.params
  const { status } = await request.json() as { status?: unknown }
  if (status !== 'new' && status !== 'contacted' && status !== 'closed') return noStore({ error: 'Invalid status.' }, 400)
  if (!await findById(id)) return noStore({ error: 'Enquiry not found.' }, 404)
  await db().prepare('UPDATE enquiries SET status = ? WHERE id = ?').bind(status, id).run()
  return noStore({ ok: true })
}

export async function DELETE(request: Request, context: Context) {
  if (!await isAdmin()) return noStore({ error: 'Unauthorized.' }, 401)
  if (!sameOrigin(request)) return noStore({ error: 'Invalid request origin.' }, 403)
  const { id } = await context.params
  await db().prepare('DELETE FROM enquiries WHERE id = ?').bind(id).run()
  return noStore({ ok: true })
}
