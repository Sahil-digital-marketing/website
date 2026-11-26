import type { Metadata } from 'next'
import { SiteHeader } from '../../src/components/SiteHeader'
import { SiteFooter } from '../../src/components/SiteFooter'

export const metadata: Metadata = { title: 'Privacy notice | SAHIL Digital Marketing', description: 'How SAHIL Digital Marketing uses enquiry information.' }

export default function PrivacyPage() {
  return <div className="site-shell service-page"><SiteHeader /><main className="privacy-page" id="main-content"><p className="eyebrow">SAHIL / Privacy</p><h1>Privacy notice</h1><p>When you send an enquiry, we store your name, email address, selected service and package, project description, and any business name, phone number, budget or timeline you provide. We also store the submission time, a reference number, the enquiry status and whether our emails were delivered.</p><p>We use this information to review your request, contact you about it, and send you a confirmation email. An administrator receives a copy by email. The information is stored in Cloudflare D1 and is kept until an administrator deletes the enquiry. Email delivery is handled by Cloudflare Queues and the configured SMTP account.</p><p>Cloudflare Turnstile checks form submissions for abuse. The security check sends technical information to Cloudflare under its own privacy terms. We do not use enquiry details for marketing mail without a separate request.</p><p>To ask about, correct or request deletion of your enquiry, contact <a href="mailto:akashshenvi93@gmail.com">akashshenvi93@gmail.com</a> and include your reference number if you have it.</p></main><SiteFooter /></div>
}
