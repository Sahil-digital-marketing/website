import { navigationLinks } from '../data/landing'
import { homeSectionHref, isCurrentNavPath } from '../lib/navigation'

export function Navbar() {
  return (
    <nav className="main-nav" aria-label="Primary navigation">
      {navigationLinks.map((link) => (
        <a href={link.href.startsWith('#') ? homeSectionHref(link.href) : link.href} key={link.href} aria-current={isCurrentNavPath(link.href) ? 'page' : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
