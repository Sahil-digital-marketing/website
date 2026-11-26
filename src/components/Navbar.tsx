import { useEffect, useState } from 'react'
import { navigationLinks } from '../data/landing'
import { homeSectionHref, isCurrentNavPath } from '../lib/navigation'

export function Navbar() {
  const [path, setPath] = useState('')
  useEffect(() => setPath(window.location.pathname), [])
  return (
    <nav className="main-nav" aria-label="Primary navigation">
      {navigationLinks.map((link) => (
        <a href={link.href.startsWith('#') ? homeSectionHref(link.href) : link.href} key={link.href} aria-current={isCurrentNavPath(link.href, path) ? 'page' : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
