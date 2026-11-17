import { ArrowIcon } from './ArrowIcon'
import { Brand } from './Brand'
import { MobileNavigation } from './MobileNavigation'
import { Navbar } from './Navbar'
import { ThemeToggle } from './ThemeToggle'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <Navbar />
        <div className="header-actions">
          <ThemeToggle />
          <a className="button button-small" href="#contact">Start a Project <ArrowIcon /></a>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
