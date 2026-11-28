'use client'

import { useEffect, useState } from 'react'

export function MotionControl() {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let saved = false
    try { saved = sessionStorage.getItem('sahil-motion-paused') === '1' } catch { /* Storage is optional. */ }
    const shouldPause = reduced || saved
    setPaused(shouldPause)
    document.documentElement.classList.toggle('motion-paused', shouldPause)
  }, [])

  function toggle() {
    const next = !paused
    setPaused(next)
    document.documentElement.classList.toggle('motion-paused', next)
    try { sessionStorage.setItem('sahil-motion-paused', next ? '1' : '0') } catch { /* The control still works for this page. */ }
    window.dispatchEvent(new CustomEvent('sahil-motion-change', { detail: { paused: next } }))
  }

  return <button className="motion-control" type="button" aria-pressed={paused} onClick={toggle} aria-label={paused ? 'Play decorative motion' : 'Pause decorative motion'} title={paused ? 'Play motion' : 'Pause motion'}>
    {paused ? <span aria-hidden="true">▶</span> : <span aria-hidden="true">Ⅱ</span>}
    <span className="motion-control-label">{paused ? 'Play motion' : 'Pause motion'}</span>
  </button>
}
