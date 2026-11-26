import { sendSmtp } from './smtp'
import type { Bindings, MailMessage } from './bindings'
import type { Enquiry } from './enquiries'
import { services } from '../src/data/landing'

const adminEmail = 'akashshenvi93@gmail.com'
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

function details(enquiry: Enquiry) {
  return [
    ['Reference', enquiry.id], ['Submitted', enquiry.created_at],
    ['Service', services.find(service => service.id === enquiry.service)?.title || enquiry.service],
    ['Package', enquiry.package_id || 'To be discussed'], ['Name', enquiry.name],
    ['Email', enquiry.email], ['Business', enquiry.company || '—'], ['Phone', enquiry.phone || '—'],
    ['Project', enquiry.project], ['Budget', enquiry.budget || '—'], ['Timeline', enquiry.timeline || '—'],
  ]
}

function template(message: MailMessage, enquiry?: Enquiry) {
  if (message.kind === 'code') {
    const code = message.code || ''
    return {
      to: adminEmail, subject: 'Your SAHIL admin sign-in code',
      text: `Your SAHIL admin sign-in code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
      html: `<div style="font:16px/1.5 Arial,sans-serif;max-width:560px;margin:auto;color:#071B45"><p style="font-weight:bold;color:#0E4EB2">SAHIL DIGITAL MARKETING</p><h1 style="font-size:26px">Sign-in code</h1><p>Use this code to open your private enquiry dashboard:</p><p style="font-size:32px;font-weight:bold;letter-spacing:.2em">${escapeHtml(code)}</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p></div>`,
    }
  }
  if (!enquiry) throw new Error('Enquiry not found')
  const service = services.find(item => item.id === enquiry.service)?.title || enquiry.service
  if (message.kind === 'client') return {
    to: enquiry.email, subject: `We received your ${service} enquiry | SAHIL`,
    text: `Hi ${enquiry.name},\n\nThank you for contacting SAHIL Digital Marketing. We received your ${service} enquiry. Your reference is ${enquiry.id}.\n\nWe will use your details to review your request and reply by email or phone.\n\nSAHIL Digital Marketing`,
    html: `<div style="font:16px/1.6 Arial,sans-serif;max-width:600px;margin:auto;color:#071B45"><p style="font-weight:bold;color:#0E4EB2">SAHIL DIGITAL MARKETING</p><h1 style="font-size:28px">Thank you for reaching out.</h1><p>Hi ${escapeHtml(enquiry.name)},</p><p>We received your <strong>${escapeHtml(service)}</strong> enquiry. Your reference is <strong>${escapeHtml(enquiry.id)}</strong>.</p><p>We will use your details to review your request and reply by email or phone.</p><p style="border-top:1px solid #C7D6F4;padding-top:18px">SAHIL Digital Marketing<br>The signature of success.</p></div>`,
  }
  const fields = details(enquiry)
  return {
    to: adminEmail, subject: `New ${service} enquiry | ${enquiry.name}`,
    text: `A new enquiry was received.\n\n${fields.map(([label, content]) => `${label}: ${content}`).join('\n')}`,
    html: `<div style="font:16px/1.5 Arial,sans-serif;max-width:640px;margin:auto;color:#071B45"><p style="font-weight:bold;color:#0E4EB2">SAHIL DIGITAL MARKETING</p><h1 style="font-size:28px">New enquiry</h1><table style="border-collapse:collapse;width:100%">${fields.map(([label, content]) => `<tr><th style="text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #C7D6F4">${escapeHtml(label)}</th><td style="padding:9px;border-bottom:1px solid #C7D6F4;white-space:pre-wrap">${escapeHtml(content)}</td></tr>`).join('')}</table></div>`,
  }
}

export async function deliver(message: MailMessage, env: Bindings) {
  const kind = message.kind
  const enquiry = message.enquiryId ? await env.DB.prepare('SELECT * FROM enquiries WHERE id = ?').bind(message.enquiryId).first<Enquiry>() : null
  if (kind !== 'code' && !enquiry) return
  if (enquiry && kind !== 'code' && enquiry[`${kind}_email_state`] === 'delivered') return
  const port = Number(env.SMTP_PORT || 465)
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.SMTP_FROM || ![465, 587].includes(port)) throw new Error('SMTP is not configured')
  try {
    await sendSmtp({ host: env.SMTP_HOST, port, user: env.SMTP_USER, password: env.SMTP_PASSWORD, from: env.SMTP_FROM }, template(message, enquiry || undefined))
    if (enquiry && kind !== 'code') await env.DB.prepare(`UPDATE enquiries SET ${kind}_email_state = 'delivered', ${kind}_email_error = NULL WHERE id = ?`).bind(enquiry.id).run()
  } catch (error) {
    if (enquiry && kind !== 'code') await env.DB.prepare(`UPDATE enquiries SET ${kind}_email_state = 'failed', ${kind}_email_error = ? WHERE id = ?`).bind(error instanceof Error ? error.message.slice(0, 300) : 'Delivery failed', enquiry.id).run()
    throw error
  }
}
