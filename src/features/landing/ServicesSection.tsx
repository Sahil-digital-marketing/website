import { useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EditorialImage } from '../../components/EditorialImage'
import { EnquiryLink } from '../../components/EnquiryLink'
import { homeImages } from '../../data/homeImages'
import { services } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="services" id="services" aria-labelledby="services-title" ref={sectionRef}>
      <div className="services-cell" data-reveal-group>
        <h2 id="services-title" data-reveal>
          <span>Two ways</span>
          <span className="services-zag">to move forward.</span>
        </h2>
        <EditorialImage className="services-photo" image={homeImages.web} sizes="(max-width: 900px) 94vw, 46vw" />
        <div className="services-cell-foot" data-reveal>
          <p>Build a useful digital home, then keep your brand visible with a monthly growth plan.</p>
          <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
        </div>
      </div>
      <ul className="services-rows" data-reveal-group>
        {services.map((service) => (
          <li className="service-row photo-field" key={service.id} data-reveal>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-row-side">
              <p className="service-terms">{service.terms.join(', ')}</p>
              <a className="text-link" href={service.href}>
                Details<span className="visually-hidden"> for {service.title}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
