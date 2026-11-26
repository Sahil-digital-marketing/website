import { bindings } from '../../../server/bindings'

export const runtime = 'edge'

export function GET() {
  const enquiryEnabled = bindings().MAIL_ENABLED === 'true'
  return Response.json({
    enquiryEnabled,
    turnstileSiteKey: enquiryEnabled ? bindings().TURNSTILE_SITE_KEY || '' : '',
  }, { headers: { 'Cache-Control': 'no-store' } })
}
