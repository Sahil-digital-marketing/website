import { useRef } from 'react'
import { about } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'
import { ArrowIcon } from '../../components/ArrowIcon'
import { AmbientScene } from '../../components/AmbientScene'
import { EditorialImage } from '../../components/EditorialImage'
import { homeImages } from '../../data/homeImages'

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section about" id="about" aria-labelledby="about-title" ref={sectionRef}>
      <AmbientScene kind="orbit" />
      <p className="section-kicker">01 / WHO WE ARE</p>
      <h2 id="about-title">Built to soar.<br /><em>Designed to lead.</em></h2>
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
          <strong>{about.lead}</strong> {about.statement}
        </p>
        <p className="about-statement about-statement--soft" data-reveal>{about.philosophy}</p>
        <a className="text-link" href="/about" data-reveal>More about us <ArrowIcon /></a>
      </div>
      <figure className="about-photo" data-reveal>
        <EditorialImage image={homeImages.discovery} sizes="(max-width: 900px) 90vw, 32vw" />
        <figcaption>Ideas take shape together.</figcaption>
      </figure>
    </section>
  )
}
