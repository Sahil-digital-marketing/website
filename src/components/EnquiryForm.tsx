import { useEffect, useState, type FormEvent } from 'react'
import { services } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'

type EnquiryFormProps = {
  selectedService: string
}

export function EnquiryForm({ selectedService }: EnquiryFormProps) {
  const [formStatus, setFormStatus] = useState('')
  const [service, setService] = useState(selectedService)

  useEffect(() => setService(selectedService), [selectedService])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus('Your details are complete. This preview has not sent or saved your enquiry.')
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} onChange={() => setFormStatus('')} aria-describedby="enquiry-preview-note">
      <div className="field-row">
        <label htmlFor="enquiry-name">
          Full name
          <input id="enquiry-name" name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label htmlFor="enquiry-email">
          Email address
          <input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      </div>
      <label htmlFor="enquiry-service">
        What can we help with?
        <select id="enquiry-service" name="service" value={service} onChange={(event) => setService(event.target.value)} required>
          <option value="" disabled>Select a service</option>
          {services.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </label>
      <label htmlFor="enquiry-project">
        A little about your project
        <textarea id="enquiry-project" name="project" rows={4} required maxLength={5000} />
      </label>
      <div className="field-row">
        <label htmlFor="enquiry-budget">
          Budget <span className="field-optional">(optional)</span>
          <input id="enquiry-budget" name="budget" maxLength={100} />
        </label>
        <label htmlFor="enquiry-timeline">
          Timeline <span className="field-optional">(optional)</span>
          <input id="enquiry-timeline" name="timeline" maxLength={100} />
        </label>
      </div>
      <div className="form-foot">
        <p className="form-note" id="enquiry-preview-note">
          Preview form: enquiry delivery is not connected yet, so no details are sent or saved.
        </p>
        <button className="button button-primary" type="submit">
          Review enquiry <ArrowIcon />
        </button>
      </div>
      <p className="form-status" role="status">{formStatus}</p>
    </form>
  )
}
