import { useEffect, useRef, useState } from 'react'
import { navigationLinks } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 901px)')
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
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
          {navigationLinks.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setIsOpen(false)}>
              <span>0{index + 1}</span>{link.label}<ArrowIcon />
            </a>
          ))}
          <a className="button button-primary" href="#contact" onClick={() => setIsOpen(false)}>Start a Project <ArrowIcon /></a>
        </nav>
      )}
    </div>
  )
}
