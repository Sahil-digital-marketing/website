import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './motion'

/* A gentle pull toward the pointer, clamped so the control never leaves its
   own hit area. Reserved for the one or two focal actions per screen. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return

    const xTo = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' })
    function onPointerMove(event: PointerEvent) {
      const rect = element!.getBoundingClientRect()
      xTo((event.clientX - rect.left - rect.width / 2) * strength)
      yTo((event.clientY - rect.top - rect.height / 2) * strength)
    }
    function onPointerLeave() {
      xTo(0)
      yTo(0)
    }
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerleave', onPointerLeave)
    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [strength])

  return ref
}
