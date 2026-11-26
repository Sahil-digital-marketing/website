 'use client'
import { ArrowIcon } from '../components/ArrowIcon'
import { EditorialImage } from '../components/EditorialImage'
import { ServicePageLayout } from '../components/ServicePageLayout'
import { growthPackages, growthPlanNote, growthQuoteHref } from '../data/growthPackages'
import { homeImages } from '../data/homeImages'

export function DigitalGrowthPage() {
  return (
    <ServicePageLayout>
      <section className="service-hero growth-hero" id="top" aria-labelledby="growth-page-title">
        <div>
          <a className="breadcrumb" href="/services">Services / Digital Growth</a>
          <p className="eyebrow">Monthly plans</p>
          <h1 id="growth-page-title">Show up with a plan.</h1>
          <p className="growth-hero-summary">Social content, clear direction and useful reporting, scaled to the level of support your brand needs.</p>
          <div className="growth-hero-actions">
            <a className="button button-primary" href={growthQuoteHref()} target="_blank" rel="noopener noreferrer">Ask for a quote <ArrowIcon /></a>
            <a className="text-link" href="#plans">Compare plans <ArrowIcon direction="down" /></a>
          </div>
        </div>
        <EditorialImage className="growth-hero-image" image={homeImages.social} sizes="(max-width: 900px) 94vw, 42vw" loading="eager" />
      </section>

      <section className="growth-intro" aria-labelledby="growth-intro-title">
        <p className="eyebrow">Digital Growth</p>
        <div>
          <h2 id="growth-intro-title">A monthly rhythm for your digital presence.</h2>
          <p>Choose the amount of content and channel support that fits your next stage. Basic focuses on a consistent social presence. Popular adds edited reels and guidance. Premium brings a broader plan that includes search and Google Ads management.</p>
        </div>
      </section>

      <section className="growth-plans" id="plans" aria-labelledby="growth-plans-title">
        <div className="service-section-heading">
          <p className="eyebrow">Choose your plan</p>
          <h2 id="growth-plans-title">Three ways to keep moving.</h2>
          <p>Each package is a monthly plan. Tell us which one you are considering and we will confirm the scope and fee with you.</p>
        </div>
        <div className="growth-plan-grid">
          {growthPackages.map((plan) => (
            <article className={`growth-plan${plan.id === 'popular' ? ' growth-plan--recommended' : ''}`} id={plan.id} key={plan.id}>
              <div className="growth-plan-head">
                <p className="eyebrow">{plan.id === 'popular' ? 'Recommended' : 'Monthly plan'}</p>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <ul className="service-inclusions" aria-label={`${plan.name} plan includes`}>
                {plan.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="growth-plan-foot">
                <p>Price confirmed in your quote.</p>
                <a className="button button-primary" href={growthQuoteHref(plan.name)} target="_blank" rel="noopener noreferrer" aria-label={`Get a quote for the ${plan.name} Digital Growth plan`}>Get a quote <ArrowIcon /></a>
              </div>
            </article>
          ))}
        </div>
        <p className="growth-plan-note">{growthPlanNote}</p>
      </section>

      <section className="growth-scope" aria-labelledby="growth-scope-title">
        <div>
          <p className="eyebrow">Before we begin</p>
          <h2 id="growth-scope-title">A clear scope makes the plan useful.</h2>
        </div>
        <div className="growth-scope-copy">
          <p>We will agree which platforms the plan covers, the source material and editing scope for reels, content approvals, and what SEO or Google Ads work includes before starting.</p>
          <p>Google Ads management is listed in Premium; the advertising budget is charged separately. No campaign result is guaranteed.</p>
        </div>
      </section>

      <section className="growth-questions" aria-labelledby="growth-questions-title">
        <div className="service-section-heading">
          <p className="eyebrow">Good to know</p>
          <h2 id="growth-questions-title">Questions before you choose.</h2>
        </div>
        <div className="growth-question-grid">
          <div><h3>Are these monthly packages?</h3><p>Yes. The post counts and other listed deliverables apply to a monthly plan.</p></div>
          <div><h3>Is the Google Ads budget included?</h3><p>No. Premium includes Google Ads management; ad spend is charged separately.</p></div>
          <div><h3>Do the plans have fixed prices?</h3><p>We will quote the monthly fee after confirming your platforms, content needs and exact work involved.</p></div>
        </div>
      </section>

      <section className="growth-final-cta" aria-labelledby="growth-cta-title">
        <div><p className="eyebrow">Ready to discuss?</p><h2 id="growth-cta-title">Find your monthly plan.</h2></div>
        <a className="button button-primary" href={growthQuoteHref()} target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp <ArrowIcon /></a>
      </section>
    </ServicePageLayout>
  )
}
