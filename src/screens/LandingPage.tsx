 'use client'
import { useEffect, useState } from 'react'
import { ReaderDialog } from '../components/ReaderDialog'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import type { FieldNote } from '../data/landing'
import { AboutSection } from '../features/landing/AboutSection'
import { ContactSection } from '../features/landing/ContactSection'
import { FieldNotesSection } from '../features/landing/FieldNotesSection'
import { HeroSection } from '../features/landing/HeroSection'
import { ProcessSection } from '../features/landing/ProcessSection'
import { ServiceExplorer } from '../features/landing/ServiceExplorer'
import { ServicesSection } from '../features/landing/ServicesSection'
import { VisionSection } from '../features/landing/VisionSection'
import { ScrollTrigger, startSmoothScroll } from '../lib/motion'

export function LandingPage() {
  const [exploredService, setExploredService] = useState('web')
  const [openNote, setOpenNote] = useState<FieldNote | null>(null)

  useEffect(() => {
    const stop = startSmoothScroll()
    // Layout settles once fonts and images arrive; re-measure scroll scenes then.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    void document.fonts?.ready.then(refresh)
    if (window.location.hash === '#contact') {
      void document.fonts.ready.then(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    }
    return () => {
      stop()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <VisionSection />
        <ServicesSection />
        <ProcessSection />
        <ServiceExplorer selectedId={exploredService} onSelect={setExploredService} />
        <FieldNotesSection onOpenNote={setOpenNote} />
        <ContactSection />
      </main>
      <SiteFooter />
      <ReaderDialog note={openNote} onClose={() => setOpenNote(null)} />
    </div>
  )
}
