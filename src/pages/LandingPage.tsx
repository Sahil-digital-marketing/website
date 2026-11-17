import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { ApproachSection } from '../features/landing/ApproachSection'
import { ContactSection } from '../features/landing/ContactSection'
import { FaqSection } from '../features/landing/FaqSection'
import { HeroSection } from '../features/landing/HeroSection'
import { IntroductionSection } from '../features/landing/IntroductionSection'
import { ServicesSection } from '../features/landing/ServicesSection'

export function LandingPage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <IntroductionSection />
        <ServicesSection />
        <ApproachSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
