import { useEffect, useRef, useState } from 'react'
import { navigationLinks } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'
import { homeSectionHref, isCurrentNavPath } from '../lib/navigation'
import { EnquiryLink } from './EnquiryLink'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [path, setPath] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => setPath(window.location.pathname), [])

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('menu-open')
    document.querySelector<HTMLAnchorElement>('#mobile-navigation-panel a')?.focus()

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
      if (event.key === 'Tab') {
        const links = [...document.querySelectorAll<HTMLElement>('#mobile-navigation-panel a, #mobile-navigation-panel button')]
        const first = links[0]
        const last = links[links.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 901px)')
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [isOpen])

  return (
    <div className="mobile-navigation">
      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span /><span />
      </button>
      {isOpen && (
        <nav id="mobile-navigation-panel" className="mobile-navigation-panel" aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <a href={link.href.startsWith('#') ? homeSectionHref(link.href) : link.href} key={link.href} aria-current={isCurrentNavPath(link.href, path) ? 'page' : undefined} onClick={() => setIsOpen(false)}>
              {link.label}<ArrowIcon />
            </a>
          ))}
          <EnquiryLink className="button button-primary" onClick={() => setIsOpen(false)}>Start a Project <ArrowIcon /></EnquiryLink>
        </nav>
      )}
    </div>
  )
}
