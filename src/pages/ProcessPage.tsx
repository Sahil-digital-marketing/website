import { ArrowIcon } from '../components/ArrowIcon'
import { EnquiryLink } from '../components/EnquiryLink'
import { ServicePageLayout } from '../components/ServicePageLayout'
import { processSteps } from '../data/landing'

export function ProcessPage() {
  return (
    <ServicePageLayout>
      <section className="process-page-hero" id="top" aria-labelledby="process-page-title">
        <p className="eyebrow">SAHIL / Our process</p>
        <div className="process-page-hero-grid">
          <h1 id="process-page-title">Good work moves forward together.</h1>
          <div className="process-page-hero-side">
            <p>From the first conversation to the next informed decision, we keep the work clear and give you a place in every stage.</p>
            <a className="text-link" href="#the-process">See how we work <ArrowIcon direction="down" /></a>
          </div>
        </div>
        <p className="process-page-hero-index" aria-hidden="true">01 <span /> 04</p>
      </section>

      <section id="the-process" aria-labelledby="process-page-steps-title">
        <div className="process-page-intro">
          <p className="eyebrow">A clear way through</p>
          <div>
            <h2 id="process-page-steps-title">Four steps. One shared direction.</h2>
            <p>Every project has its own scope. These are the conversations and decisions that help us work well together, whether we are building a website or planning digital growth.</p>
          </div>
        </div>

        <ol className="process-page-steps" aria-label="Our four process stages">
          {processSteps.map((step, index) => (
            <li className="process-page-step" key={step.line}>
              <span className="process-page-step-number" aria-hidden="true">0{index + 1}</span>
              <div className="process-page-step-main">
                <h3>{step.line}</h3>
                <p>{step.detail}</p>
              </div>
              <div className="process-page-step-details">
                <div><p className="eyebrow">What we do</p><p>{step.agencyRole}</p></div>
                <div><p className="eyebrow">What we need from you</p><p>{step.clientRole}</p></div>
                <p className="process-page-checkpoint"><span>Moving forward with</span>{step.checkpoint}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="process-page-next" aria-labelledby="process-page-next-title">
        <div>
          <p className="eyebrow">The details matter</p>
          <h2 id="process-page-next-title">A plan that fits the work.</h2>
        </div>
        <div className="process-page-next-copy">
          <p>Deliverables, review points and reporting depend on the service and scope. We agree the relevant details with you before work begins, so you know what to expect and when your input is needed.</p>
          <a className="text-link" href="/services">Explore our services <ArrowIcon /></a>
        </div>
      </section>

      <section className="process-page-cta" aria-labelledby="process-page-cta-title">
        <div>
          <p className="eyebrow">Your first step</p>
          <h2 id="process-page-cta-title">Tell us what you have in mind.</h2>
        </div>
        <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
      </section>
    </ServicePageLayout>
  )
}
