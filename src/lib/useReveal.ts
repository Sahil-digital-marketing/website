import { useLayoutEffect, type RefObject } from 'react'
import { easeOut, gsap, prefersReducedMotion } from './motion'

/* Each [data-reveal] child of the section rises in once, in reading order,
   as the section enters. Without script or with reduced motion the content
   is simply there. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion()) return

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]', root).forEach((group) => {
        gsap.from(group.querySelectorAll('[data-reveal]'), {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.08,
          ease: easeOut,
          scrollTrigger: { trigger: group, start: 'top 92%', once: true },
        })
      })
    }, root)

    return () => context.revert()
  }, [scope])
}
