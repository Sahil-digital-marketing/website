import { useRef } from 'react'
import { SectionPhoto } from '../../components/SectionPhoto'
import { homeImages } from '../../data/homeImages'
import { about } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="colour-page vision photo-field" aria-labelledby="vision-title" ref={sectionRef}>
      <SectionPhoto image={homeImages.discovery} />
      <div className="section vision-inner" data-reveal-group>
        <h2 id="vision-title" data-reveal>Built to rise above.</h2>
        <div className="vision-pair">
          <div data-reveal>
            <h3>Our vision</h3>
            <p>{about.vision}</p>
          </div>
          <div data-reveal>
            <h3>Our mission</h3>
            <p>{about.mission}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
