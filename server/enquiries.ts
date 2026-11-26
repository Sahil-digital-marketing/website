import { bindings } from './bindings'
import type { Enquiry } from '../shared/enquiry'

export type { Enquiry }

export function db() { return bindings().DB }

export async function findById(id: string) {
  return db().prepare('SELECT * FROM enquiries WHERE id = ?').bind(id).first<Enquiry>()
}

export function value(input: unknown, limit: number, required = false, multiline = false) {
  if (typeof input !== 'string') return required ? null : ''
  const trimmed = input.trim()
  const invalidControls = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/
  return trimmed.length <= limit && !invalidControls.test(trimmed) && (!required || trimmed.length > 0) ? trimmed : null
}

export function noStore(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}
