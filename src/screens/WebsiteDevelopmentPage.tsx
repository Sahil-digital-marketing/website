 'use client'
import { ArrowIcon } from '../components/ArrowIcon'
import { EnquiryLink } from '../components/EnquiryLink'
import { EditorialImage } from '../components/EditorialImage'
import { ServicePageLayout } from '../components/ServicePageLayout'
import { WebsitePreview } from '../components/WebsitePreview'
import { formatPrice, pricingNote, websiteCategories } from '../data/websitePackages'
import { CustomDevelopment } from '../components/CustomDevelopment'
import { pageImages } from '../data/homeImages'

export function WebsiteDevelopmentPage() {
  return (
    <ServicePageLayout>
      <section className="service-hero web-hero" id="top" aria-labelledby="website-page-title">
        <div className="web-hero-copy">
          <a className="breadcrumb" href="/services">Services / Website development</a>
          <h1 id="website-page-title">Websites built around your business.</h1>
          <p className="web-hero-summary">A focused landing page. A working business website. A store ready for its first order. Find the right foundation here.</p>
          <p className="hero-price">Starting at <strong>₹5,000</strong></p>
          <p className="pricing-note">{pricingNote}</p>
          <a className="button button-primary" href="#packages">Explore packages <ArrowIcon direction="down" /></a>
        </div>
        <EditorialImage className="web-hero-photo" image={pageImages.webDetail} sizes="(max-width: 900px) 94vw, 42vw" loading="eager" />
      </section>
      <section className="website-types" aria-labelledby="website-types-title">
        <div className="service-section-heading"><p className="eyebrow">Built for your next step</p><h2 id="website-types-title">Find the right fit for your idea.</h2></div>
        <div className="website-types-grid">{websiteCategories.map((category, index) => (
          <a className="website-type" href={`#${category.id}`} key={category.id}>
            <span className="eyebrow">0{index + 1}</span><h3>{category.title}</h3><p>{category.description}</p><span className="type-price">Starting at {formatPrice(category.packages[0].price)} <ArrowIcon direction="down" /></span>
          </a>
        ))}<a className="website-type" href="#custom-development"><span className="eyebrow">04</span><h3>Custom software & apps</h3><p>From billing software to business portals and applications, build around your specific requirements.</p><span className="type-price">Request a quote <ArrowIcon direction="down" /></span></a></div>
      </section>
      <div id="packages" className="package-sections">
        {websiteCategories.map((category, index) => (
          <section className="package-section" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
            <div className="package-intro"><div><p className="eyebrow">0{index + 1} / Website packages</p><h2 id={`${category.id}-title`}>{category.title}</h2><p>{category.description}</p></div><WebsitePreview kind={category.id as 'landing' | 'business' | 'ecommerce'} /></div>
            <div className="package-grid">{category.packages.map(item => (
              <article className={`package-card${item.tier === 'Standard' ? ' package-card--featured' : ''}`} key={item.id} data-package={item.id}>
                <div className="package-tier"><h3>{item.tier}</h3>{item.tier === 'Standard' && <span className="package-badge">Balanced choice</span>}</div>
                <p className="package-price"><span>Starting at</span><strong>{formatPrice(item.price)}</strong><small>Price varies with project complexity.</small></p>
                <p className="package-audience">For {item.audience.toLowerCase()}.</p>
                <ul className="service-inclusions">{item.includes.map(feature => <li key={feature}>{feature}</li>)}</ul>
                <EnquiryLink className="button button-primary" service="web" packageId={item.id} aria-label={`Enquire about ${category.title} ${item.tier}`}>Enquire about this package <ArrowIcon /></EnquiryLink>
              </article>
            ))}</div>
            <p className="pricing-note package-qualification">{pricingNote}</p>
          </section>
        ))}
      </div>
      <div className="custom-development-wrap"><CustomDevelopment /></div>
      <aside className="pricing-clarity"><h2>A clear scope before we start.</h2><p>Choose a starting package and tell us what you need. We’ll agree the features, integrations and final price with you before work begins.</p><p>Any recurring service costs and hosting arrangements will be confirmed in your proposal.</p></aside>
    </ServicePageLayout>
  )
}
