'use client'

import { useEffect, useState } from 'react'

export function IntroSequence() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try {
      if (sessionStorage.getItem('sahil-intro-seen')) return
      sessionStorage.setItem('sahil-intro-seen', '1')
    } catch {
      // The animation can still run when session storage is unavailable.
    }
    setActive(true)
    const timer = window.setTimeout(() => setActive(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!active) return null
  return <div className="intro-sequence" role="presentation">
    <span className="intro-signal" aria-hidden="true" />
    <img src="/brand/sahil-logo.webp" width="481" height="268" alt="" />
    <span className="intro-caption">THE SIGNATURE OF SUCCESS</span>
    <button type="button" onClick={() => setActive(false)}>Skip intro</button>
  </div>
}
