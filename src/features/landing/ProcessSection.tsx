import { useLayoutEffect, useRef } from 'react'
import { processSteps } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'
import { ArrowIcon } from '../../components/ArrowIcon'
import { gsap, prefersReducedMotion } from '../../lib/motion'

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  useReveal(sectionRef)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || prefersReducedMotion()) return
    const media = gsap.matchMedia()
    media.add('(min-width: 1100px)', () => {
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth + 2 * 48)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => section.style.setProperty('--journey-progress', `${self.progress * 100}%`),
        },
      })
      return () => { tween.scrollTrigger?.kill(); tween.kill(); section.style.removeProperty('--journey-progress') }
    })
    return () => media.revert()
  }, [])

  return (
    <section className="section process" id="process" aria-labelledby="process-title" ref={sectionRef}>
      <div className="process-heading-row">
        <h2 id="process-title" className="process-heading">How we work</h2>
        <a className="text-link" href="/process">Explore our process <ArrowIcon /></a>
      </div>
      <div className="process-flight" aria-hidden="true"><span className="process-flight-line" /><span className="process-flight-eagle">➤</span></div>
      <ol className="process-steps" data-reveal-group ref={trackRef}>
        {processSteps.map((step, index) => (
          <li className="process-step" key={step.line} data-reveal>
            <span className="process-number" aria-hidden="true">0{index + 1}</span>
            <div>
              <h3 className="process-line">{step.line}</h3>
              <p className="process-detail">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
