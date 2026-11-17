import { navigationLinks } from '../data/landing'

export function Navbar() {
  return (
    <nav className="main-nav" aria-label="Primary navigation">
      {navigationLinks.map((link) => (
        <a href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
