'use client'
import { useEffect, useRef } from 'react'
import { useMagnetic } from '../lib/useMagnetic'
import { ArrowIcon } from './ArrowIcon'
import { Brand } from './Brand'
import { MobileNavigation } from './MobileNavigation'
import { Navbar } from './Navbar'
import { ThemeToggle } from './ThemeToggle'
import { EnquiryLink } from './EnquiryLink'
import { MotionControl } from './MotionControl'
import { CursorHalo } from './CursorHalo'

export function SiteHeader() {
  const ctaRef = useMagnetic<HTMLAnchorElement>()
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    function update() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`
        frame = 0
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="site-header">
      <span className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <CursorHalo />
      <div className="header-inner">
        <Brand />
        <Navbar />
        <div className="header-actions">
          <MotionControl />
          <ThemeToggle />
          <EnquiryLink ref={ctaRef} className="button button-primary button-small">Start a Project <ArrowIcon /></EnquiryLink>
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
