import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { ContactSection } from '../features/landing/ContactSection'

export function ServicePageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell service-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <ContactSection />
      <SiteFooter />
    </div>
  )
}
