import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { services } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'
import { findWebsitePackage, formatPrice, pricingNote, websiteCategories } from '../data/websitePackages'
import { customDevelopment } from '../data/customDevelopment'
import type { EnquirySelection } from './EnquiryContext'
import { Turnstile } from './Turnstile'

type EnquiryFormProps = {
  selection: EnquirySelection
  onSelectionChange: (selection: EnquirySelection) => void
}

export function EnquiryForm({ selection, onSelectionChange }: EnquiryFormProps) {
  const formId = useId()
  const [formStatus, setFormStatus] = useState('')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formAvailable, setFormAvailable] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const token = useRef('')
  const submissionKey = useRef('')
  const submitting = useRef(false)
  const onToken = useCallback((next: string) => { token.current = next }, [])
  const { service, packageId } = selection
  const selectedPackage = service === 'web' ? findWebsitePackage(packageId ?? null) : undefined
  const isCustomProject = service === 'web' && packageId === customDevelopment.packageId
  const selectedTitle = isCustomProject ? customDevelopment.title : services.find(item => item.id === service)?.title ?? ''
  useEffect(() => setFormStatus(''), [service, packageId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || sent) return
    if (!token.current) { setFormStatus('Please complete the security check.'); return }
    submitting.current = true
    setPending(true)
    setFormStatus('Saving your enquiry…')
    const fields = new FormData(event.currentTarget)
    if (!submissionKey.current) submissionKey.current = crypto.randomUUID()
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionKey: submissionKey.current, service, packageId: packageId || '',
          name: fields.get('name'), email: fields.get('email'), company: fields.get('company'),
          phone: fields.get('phone'), project: fields.get('project'), budget: fields.get('budget'),
          timeline: fields.get('timeline'), turnstileToken: token.current,
        }),
      })
      const result = await response.json() as { error?: string, reference?: string }
      if (!response.ok) throw new Error(result.error || 'Could not save your enquiry.')
      setSent(true)
      setFormStatus(`Thank you. Your enquiry was saved. Reference: ${result.reference}`)
    } catch (error) {
      setFormStatus(`${error instanceof Error ? error.message : 'Could not save your enquiry.'} Please try again.`)
      token.current = ''
      setResetKey(value => value + 1)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} onChange={() => { if (!sent) setFormStatus('') }} aria-describedby={`${formId}-preview-note`}>
      <div className="enquiry-form-heading"><h3>Let’s discuss your project.</h3><p>Choose a service, share your requirements and tell us the budget you have in mind.</p></div>
      <label htmlFor={`${formId}-service`}>
        What can we help with?
        <select id={`${formId}-service`} name="service" value={service} onChange={event => onSelectionChange({ service: event.target.value })} required>
          <option value="" disabled>Select a service</option>
          {services.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      {service === 'web' && <label htmlFor={`${formId}-package`}>Website package
        <select id={`${formId}-package`} name="website-package" value={packageId ?? ''} onChange={event => onSelectionChange({ service: 'web', packageId: event.target.value || undefined })}>
          <option value="">Help me choose / Custom requirements</option>
          {websiteCategories.map(category => <optgroup key={category.id} label={category.title}>{category.packages.map(item => <option key={item.id} value={item.id}>{item.tier} — starting at {formatPrice(item.price)}</option>)}</optgroup>)}
          <option value={customDevelopment.packageId}>{customDevelopment.title} — request a quote</option>
        </select>
      </label>}
      {service && <div className={`enquiry-summary${selectedPackage ? ' selected-package' : ''}${isCustomProject ? ' custom-enquiry' : ''}`} role="status">
        <span className="eyebrow">{selectedPackage ? 'Your starting package' : 'Your enquiry'}</span>
        <strong>{selectedPackage ? `${selectedPackage.category} / ${selectedPackage.tier}` : selectedTitle}</strong>
        <span>{selectedPackage ? `Starting at ${formatPrice(selectedPackage.price)}` : 'Custom quote — pricing confirmed after reviewing your requirements.'}</span>
        {selectedPackage && <><p className="pricing-note">{pricingNote}</p><input type="hidden" name="package" value={selectedPackage.id} /></>}
        {isCustomProject && <input type="hidden" name="package" value={customDevelopment.packageId} />}
      </div>}
      <div className="field-row">
        <label htmlFor={`${formId}-name`}>
          Full name
          <input id={`${formId}-name`} name="name" placeholder="Your full name" autoComplete="name" required maxLength={100} />
        </label>
        <label htmlFor={`${formId}-email`}>
          Email address
          <input id={`${formId}-email`} name="email" type="email" placeholder="you@company.com" autoComplete="email" required maxLength={254} />
        </label>
      </div>
      <div className="field-row">
        <label htmlFor={`${formId}-company`}>Business name (optional)<input id={`${formId}-company`} name="company" autoComplete="organization" placeholder="Your business or brand" maxLength={150} /></label>
        <label htmlFor={`${formId}-phone`}>Phone / WhatsApp (optional)<input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" maxLength={30} /></label>
      </div>
      <label htmlFor={`${formId}-project`}>
        A little about your project
        <textarea id={`${formId}-project`} name="project" placeholder={isCustomProject ? 'Describe your idea, such as billing software, an inventory tool or a custom application. What should it do and who will use it?' : 'Tell us about your business, goals and what you need help with.'} rows={4} required maxLength={5000} />
      </label>
      <div className="field-row">
        <label htmlFor={`${formId}-budget`}>
          Budget <span className="field-optional">(optional)</span>
          <input id={`${formId}-budget`} name="budget" placeholder="Your budget range in ₹" maxLength={100} />
        </label>
        <label htmlFor={`${formId}-timeline`}>
          Timeline <span className="field-optional">(optional)</span>
          <input id={`${formId}-timeline`} name="timeline" placeholder="When would you like to start?" maxLength={100} />
        </label>
      </div>
      <div className="form-foot">
        <p className="form-note" id={`${formId}-preview-note`}>
          We use your details to review your request, contact you and send a confirmation email. Read our <a href="/privacy">privacy notice</a>.
        </p>
        <Turnstile onToken={onToken} onAvailability={setFormAvailable} resetKey={resetKey} />
        <button className="button button-primary" type="submit" disabled={pending || sent || !formAvailable}>
          {pending ? 'Saving…' : sent ? 'Enquiry received' : 'Send enquiry'} <ArrowIcon />
        </button>
      </div>
      <p className="form-status" role="status">{formStatus}</p>
    </form>
  )
}
