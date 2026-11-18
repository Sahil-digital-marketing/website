import { useRef } from 'react'
import { about } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section about" id="about" aria-labelledby="about-title" ref={sectionRef}>
      <h2 className="visually-hidden" id="about-title">About SAHIL Digital Marketing</h2>
      <dl className="about-facts" data-reveal-group>
        {about.facts.map((fact) => (
          <div key={fact.label} data-reveal>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="about-copy" data-reveal-group>
        <p className="about-statement" data-reveal>
          <img className="about-portrait" src="/brand/sahil-mark.webp" width="452" height="511" alt="The SAHIL eagle mark" />
          <strong>{about.lead}</strong> {about.statement}
        </p>
        <p className="about-statement about-statement--soft" data-reveal>{about.philosophy}</p>
      </div>
    </section>
  )
}
