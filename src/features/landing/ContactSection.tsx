import { useRef } from 'react'
import { EnquiryForm } from '../../components/EnquiryForm'
import { contactLinks } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

type ContactSectionProps = {
  selectedService: string
}

export function ContactSection({ selectedService }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
      <div className="contact-band" data-reveal-group>
        <h2 id="contact-title" data-reveal>Have a vision? Let us make it visible.</h2>
        <img className="contact-photo" data-reveal src="https://picsum.photos/id/785/340/340" width="340" height="340" alt="Two cupped hands holding fresh green spruce tips" loading="lazy" />
        <div className="contact-links" data-reveal>
          <p className="contact-question">Rather talk first?</p>
          <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a>
          <a href={contactLinks.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {contactLinks.whatsappNumber}</a>
          <p className="contact-note">Serving businesses across India.</p>
        </div>
      </div>
      <div className="contact-form-row" data-reveal-group>
        <p className="contact-aside" data-reveal>Tell us what you are building. Not sure where to start? That is what the first conversation is for.</p>
        <div data-reveal><EnquiryForm selectedService={selectedService} /></div>
      </div>
    </section>
  )
}
