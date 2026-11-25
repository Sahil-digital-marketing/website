import { useMagnetic } from '../lib/useMagnetic'
import { ArrowIcon } from './ArrowIcon'
import { Brand } from './Brand'
import { MobileNavigation } from './MobileNavigation'
import { Navbar } from './Navbar'
import { ThemeToggle } from './ThemeToggle'
import { EnquiryLink } from './EnquiryLink'

export function SiteHeader() {
  const ctaRef = useMagnetic<HTMLAnchorElement>()

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <Navbar />
        <div className="header-actions">
          <ThemeToggle />
          <EnquiryLink ref={ctaRef} className="button button-primary button-small">Start a Project <ArrowIcon /></EnquiryLink>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
