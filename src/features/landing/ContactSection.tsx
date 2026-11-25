import { useRef } from 'react'
import { EnquiryForm } from '../../components/EnquiryForm'
import { EditorialImage } from '../../components/EditorialImage'
import { homeImages } from '../../data/homeImages'
import { contactLinks } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'
import { useEnquiry } from '../../components/EnquiryContext'

export function ContactSection() {
  const { selection, select } = useEnquiry()
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
      <div className="contact-intro" data-reveal-group>
        <h2 id="contact-title" data-reveal>Have a vision? Let us make it visible.</h2>
        <p className="contact-aside" data-reveal>Tell us what you are building. Not sure where to start? That is what the first conversation is for.</p>
        <EditorialImage className="contact-photo" image={homeImages.discovery} sizes="(max-width: 900px) 44vw, 24vw" />
        <div className="contact-links" data-reveal>
          <p className="contact-question">Rather talk first?</p>
          <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a>
          <a href={contactLinks.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {contactLinks.whatsappNumber}</a>
          <p className="contact-note">Serving businesses across India.</p>
        </div>
      </div>
      <div className="contact-form-column" data-reveal-group>
        <div data-reveal><EnquiryForm selection={selection} onSelectionChange={select} /></div>
      </div>
    </section>
  )
}
