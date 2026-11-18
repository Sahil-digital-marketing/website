import { useLayoutEffect, useRef } from 'react'
import { processSteps } from '../../data/landing'
import { gsap, prefersReducedMotion } from '../../lib/motion'

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  /* Each line settles onto its step of the staircase as it scrolls into view,
     tied to the scrollbar so the descent reads as one movement. */
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        gsap.from(step, {
          y: 48,
          autoAlpha: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: step, start: 'top 92%', end: 'top 55%', scrub: 0.8 },
        })
      })
    }, section)
    return () => context.revert()
  }, [])

  return (
    <section className="section process" id="process" aria-labelledby="process-title" ref={sectionRef}>
      <ol className="process-steps">
        {processSteps.map((step, index) => (
          <li className="process-step" key={step.line}>
            {index === 0
              ? <h2 id="process-title" className="process-line">{step.line}</h2>
              : <p className="process-line">{step.line}</p>}
            <p className="process-detail">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
