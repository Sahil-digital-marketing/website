import { customDevelopment } from '../data/customDevelopment'
import { ArrowIcon } from './ArrowIcon'
import { EnquiryLink } from './EnquiryLink'

export function CustomDevelopment() {
  return (
    <section className="custom-development" id="custom-development" aria-labelledby="custom-development-title">
      <div>
        <p className="eyebrow">Built around your requirements</p>
        <h2 id="custom-development-title">{customDevelopment.title}</h2>
        <p>{customDevelopment.description}</p>
        <p className="custom-example-note">Examples of what we can build:</p>
        <ul className="custom-examples">{customDevelopment.examples.map(example => <li key={example}>{example}</li>)}</ul>
      </div>
      <div className="custom-quote">
        <span className="quote-label">Custom quote</span>
        <p>Tell us what you want to build. We’ll review the features, integrations and complexity, then share a project-specific price.</p>
        <EnquiryLink className="button button-primary" service="web" packageId={customDevelopment.packageId}>Enquire about pricing <ArrowIcon /></EnquiryLink>
        <p className="pricing-note">Scope and final pricing are agreed before work begins.</p>
      </div>
    </section>
  )
}
