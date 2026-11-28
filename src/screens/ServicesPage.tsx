 'use client'
import { ArrowIcon } from '../components/ArrowIcon'
import { EditorialImage } from '../components/EditorialImage'
import { ServicePageLayout } from '../components/ServicePageLayout'
import { WebsitePreview } from '../components/WebsitePreview'
import { growthPlanNote } from '../data/growthPackages'
import { pageImages } from '../data/homeImages'
import { pricingNote } from '../data/websitePackages'

export function ServicesPage() {
  return (
    <ServicePageLayout>
      <section className="service-hero services-overview-hero" id="top" aria-labelledby="services-page-title">
        <EditorialImage className="services-overview-photo" image={pageImages.servicesHero} sizes="(max-width: 900px) 100vw, 60vw" loading="eager" />
        <p className="eyebrow">SAHIL / Services</p>
        <h1 id="services-page-title">Build your presence. Grow with purpose.</h1>
        <div className="service-hero-bottom"><p>A website built for your business and a monthly plan to stay visible. Choose where you want to begin.</p><a className="text-link" href="#our-services">Explore our services <ArrowIcon direction="down" /></a></div>
      </section>
      <section className="service-catalogue" id="our-services" aria-labelledby="catalogue-title">
        <div className="service-section-heading"><p className="eyebrow">Two connected services</p><h2 id="catalogue-title">Choose where to begin.</h2></div>
        <article className="website-feature" id="web">
          <div><p className="eyebrow">01 / Website development</p><h3>A better home for your business.</h3><p>Landing pages, business websites and online stores. Choose a starting package, then shape the features around what you need.</p><p className="feature-price">Starting at <strong>₹5,000</strong></p><p className="pricing-note">{pricingNote}</p><a className="button button-primary" href="/services/website-development">View website packages <ArrowIcon /></a></div>
          <EditorialImage className="services-feature-photo" image={pageImages.servicesWeb} sizes="(max-width: 900px) 94vw, 42vw" />
        </article>
        <article className="website-feature growth-feature" id="growth">
          <div>
            <p className="eyebrow">02 / Digital Growth</p>
            <h3>Keep showing up with a plan.</h3>
            <p>Choose a monthly package for social content and planning. Higher tiers add edited reels, SEO guidance or support, and Google Ads management.</p>
            <p className="growth-feature-terms">Basic · Popular · Premium</p>
            <p className="pricing-note">{growthPlanNote}</p>
            <a className="button button-primary" href="/services/digital-growth">Compare monthly plans <ArrowIcon /></a>
          </div>
          <EditorialImage className="growth-feature-photo" image={pageImages.servicesGrowth} sizes="(max-width: 900px) 94vw, 42vw" />
        </article>
      </section>
    </ServicePageLayout>
  )
}
