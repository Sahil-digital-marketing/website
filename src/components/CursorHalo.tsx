'use client'

import { useEffect, useRef } from 'react'

export function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const halo = haloRef.current
    if (!halo) return
    let frame = 0
    let x = -100
    let y = -100
    function move(event: PointerEvent) {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        halo!.style.transform = `translate3d(${x}px, ${y}px, 0)`
        halo!.classList.toggle('is-interactive', Boolean((event.target as Element)?.closest('a, button, input, select, textarea')))
        frame = 0
      })
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => {
      document.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="cursor-halo" ref={haloRef} aria-hidden="true" />
}
