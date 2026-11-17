import { useState, type FormEvent } from 'react'
import { services } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'

export function EnquiryForm() {
  const [formStatus, setFormStatus] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus('Your details are complete. This preview has not sent or saved your enquiry.')
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} onChange={() => setFormStatus('')} aria-describedby="enquiry-preview-note">
      <div className="form-heading">
        <h3>A good place to start.</h3>
        <span>* Required</span>
      </div>
      <div className="field-row">
        <label htmlFor="enquiry-name">
          Full name *
          <input id="enquiry-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={100} />
        </label>
        <label htmlFor="enquiry-email">
          Email address *
          <input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} />
        </label>
      </div>
      <label htmlFor="enquiry-service">
        What can we help with? *
        <select id="enquiry-service" name="service" defaultValue="" required>
          <option value="" disabled>Select a service</option>
          {services.map((service) => (
            <option key={service.title}>{service.title}</option>
          ))}
        </select>
      </label>
      <label htmlFor="enquiry-project">
        A little about your project *
        <textarea id="enquiry-project" name="project" rows={3} placeholder="Your business, your goals, your next move…" required maxLength={5000} />
      </label>
      <div className="field-row">
        <label htmlFor="enquiry-budget">
          Budget <span className="field-optional">(optional)</span>
          <input id="enquiry-budget" name="budget" placeholder="Your estimated budget" maxLength={100} />
        </label>
        <label htmlFor="enquiry-timeline">
          Timeline <span className="field-optional">(optional)</span>
          <input id="enquiry-timeline" name="timeline" placeholder="When would you like to begin?" maxLength={100} />
        </label>
      </div>
      <p className="form-note" id="enquiry-preview-note">
        Preview form — enquiry delivery is not connected yet. No details are sent or saved.
      </p>
      <button className="button button-primary button-form" type="submit">
        Review enquiry <ArrowIcon />
      </button>
      <p className="form-status" role="status">{formStatus}</p>
    </form>
  )
}
