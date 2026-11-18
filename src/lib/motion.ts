import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const easeOut = 'expo.out'
const headerOffset = -96

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger and
   the smooth scroll stay in the same frame. Anchor links keep working. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {}

  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: headerOffset } })
  const tick = (time: number) => lenis.raf(time * 1000)

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  document.documentElement.classList.add('has-smooth-scroll')

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    document.documentElement.classList.remove('has-smooth-scroll')
  }
}

export { gsap, ScrollTrigger, SplitText }
