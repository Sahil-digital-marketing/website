'use client'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { ContactSection } from '../features/landing/ContactSection'
import { easeOut, gsap, prefersReducedMotion } from '../lib/motion'

export function ServicePageLayout({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const main = mainRef.current
    if (!main || prefersReducedMotion()) return
    const context = gsap.context(() => {
      main.querySelectorAll<HTMLElement>('section h1, section h2, .website-feature, .package-card, .growth-plan, .about-page-principle, .about-page-person, .process-page-step').forEach(element => {
        gsap.from(element, { autoAlpha: 0, y: 28, duration: .85, ease: easeOut, scrollTrigger: { trigger: element, start: 'top 94%', once: true } })
      })
    }, main)
    return () => context.revert()
  }, [])
  return (
    <div className="site-shell service-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" ref={mainRef}>{children}</main>
      <ContactSection />
      <SiteFooter />
    </div>
  )
}
