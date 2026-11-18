import { useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { services } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

type ServicesSectionProps = {
  onExplore: (serviceId: string) => void
}

export function ServicesSection({ onExplore }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="services" id="services" aria-labelledby="services-title" ref={sectionRef}>
      <div className="services-cell" data-reveal-group>
        <h2 id="services-title" data-reveal>
          <span>Six ways</span>
          <span className="services-zag">to be chosen.</span>
        </h2>
        <div className="services-cell-foot" data-reveal>
          <p>Every discipline is connected to one growth plan, so your brand speaks with one voice wherever people meet it.</p>
          <a className="button button-primary" href="#contact">Start a Project <ArrowIcon /></a>
        </div>
      </div>
      <ul className="services-rows" data-reveal-group>
        {services.map((service) => (
          <li className="service-row" key={service.id} data-reveal>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-row-side">
              <p className="service-terms">{service.terms.join(', ')}</p>
              <a className="text-link" href="#explore" onClick={() => onExplore(service.id)}>
                Details<span className="visually-hidden"> for {service.title}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
