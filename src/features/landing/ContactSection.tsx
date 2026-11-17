import { EnquiryForm } from '../../components/EnquiryForm'
import { ArrowIcon } from '../../components/ArrowIcon'

export function ContactSection() {
  return (
    <section className="contact-band" id="contact" aria-labelledby="contact-title">
      <div className="section contact-section">
        <div className="contact-intro">
          <p className="section-label">05 / YOUR NEXT CHAPTER</p>
          <h2 id="contact-title">Big ambition.<br /><em>Let's talk.</em></h2>
          <p>Tell us about your business, what you have in mind, and where you want to go. Every project starts with a conversation.</p>
          <div className="contact-signature"><ArrowIcon /><span>Signature of Success.</span></div>
        </div>
        <EnquiryForm />
      </div>
    </section>
  )
}
