import { ArrowIcon } from '../../components/ArrowIcon'
import { ServiceIcon } from '../../components/ServiceIcon'
import { services } from '../../data/landing'

export function ServicesSection() {
  return (
    <section className="section services-section" id="services" aria-labelledby="services-title">
      <div className="section-label">
        <span>02 / WHAT WE DO</span>
        <span>SIX CONNECTED DISCIPLINES</span>
      </div>
      <div className="section-heading">
        <h2 id="services-title">The right expertise.<br /><span className="muted-heading">A shared direction.</span></h2>
        <p>From first impressions to the next enquiry, we connect the work that helps your business move forward.</p>
      </div>
      <div className="services-list">
        {services.map((service, index) => (
          <article className="service-row" key={service.title}>
            <span className="service-number">0{index + 1}</span>
            <div className="service-title">
              <ServiceIcon name={service.icon} />
              <h3>{service.title}</h3>
            </div>
            <p>{service.description}</p>
            <a className="service-link" href="#contact" aria-label={`Discuss ${service.title}`}>
              <ArrowIcon />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
