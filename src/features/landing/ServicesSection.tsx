import { useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EnquiryLink } from '../../components/EnquiryLink'
import { EditorialImage } from '../../components/EditorialImage'
import { services } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="services" id="services" aria-labelledby="services-title" ref={sectionRef}>
      <div className="services-cell" data-reveal-group>
        <p className="section-kicker">02 / WHAT WE DO · OUR EXPERTISE</p>
        <h2 id="services-title" data-reveal>
          <span>Make your brand</span>
          <span className="services-zag">impossible to ignore.</span>
        </h2>
        <div className="services-cell-foot" data-reveal>
          <p>Two connected services. One clear way forward: build your digital home, then keep your brand visible.</p>
          <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
        </div>
      </div>
      <ul className="services-rows" data-reveal-group>
        {services.map((service, index) => (
          <li className={`service-row service-row--${service.id}`} key={service.id} data-reveal
            onPointerMove={event => {
              if (event.pointerType !== 'mouse') return
              const bounds = event.currentTarget.getBoundingClientRect()
              event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
              event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
            }}
            onPointerLeave={event => {
              event.currentTarget.style.removeProperty('--pointer-x')
              event.currentTarget.style.removeProperty('--pointer-y')
            }}>
            <span className="service-row-index">0{index + 1} / {service.id === 'web' ? 'DIGITAL HOME' : 'ONGOING MOMENTUM'}</span>
            <div className="service-row-art" aria-hidden="true">
              <EditorialImage image={service.image} sizes="(max-width: 760px) 90vw, 44vw" />
              <span className="service-row-art-label">{service.id === 'web' ? 'BUILD YOUR DIGITAL HOME' : 'CREATE · CONNECT · GROW'}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-row-side">
              <p className="service-terms">{service.terms.join(', ')}</p>
              <a className="text-link" href={service.href}>
                Explore service<span className="visually-hidden"> for {service.title}</span> <ArrowIcon />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
