import { db, noStore } from '../../../../server/enquiries'
import { isAdmin } from '../../../../server/security'

export const runtime = 'edge'

export async function GET(request: Request) {
  if (!await isAdmin()) return noStore({ error: 'Unauthorized.' }, 401)
  const url = new URL(request.url)
  const query = (url.searchParams.get('q') || '').slice(0, 100).trim().replace(/[\\%_]/g, '\\$&')
  const rows = await db().prepare(`SELECT * FROM enquiries WHERE
    name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR service LIKE ? ESCAPE '\\' OR id LIKE ? ESCAPE '\\'
    ORDER BY created_at DESC LIMIT 200`).bind(...Array(4).fill(`%${query}%`)).all()
  return noStore({ enquiries: rows.results })
}
