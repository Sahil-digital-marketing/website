 'use client'
import { ArrowIcon } from '../components/ArrowIcon'
import { EnquiryLink } from '../components/EnquiryLink'
import { EditorialImage } from '../components/EditorialImage'
import { ServicePageLayout } from '../components/ServicePageLayout'
import { aboutPage } from '../data/aboutPage'
import { about, contactLinks } from '../data/landing'
import { pageImages } from '../data/homeImages'

export function AboutPage() {
  return (
    <ServicePageLayout>
      <section className="about-page-hero" id="top" aria-labelledby="about-page-title">
        <p className="eyebrow">SAHIL / About us</p>
        <div className="about-page-hero-grid">
          <h1 id="about-page-title">Good work begins with understanding.</h1>
          <div className="about-page-hero-side">
            <p>We help brands across India move forward with connected thinking, purposeful creative work and clear next steps.</p>
            <a className="text-link" href="#our-story">Get to know us <ArrowIcon direction="down" /></a>
          </div>
        </div>
        <EditorialImage className="about-hero-photo" image={pageImages.aboutHero} sizes="(max-width: 900px) 94vw, 88vw" loading="eager" />
      </section>

      <section className="about-page-section about-page-story" id="our-story" aria-labelledby="about-story-title">
        <p className="eyebrow">Who we are</p>
        <div>
          <h2 id="about-story-title">A growth studio built around your next move.</h2>
          <p>{aboutPage.introduction}</p>
          <p>{about.philosophy}</p>
          <a className="text-link" href="/services">Explore our services <ArrowIcon /></a>
          <EditorialImage className="about-story-photo" image={pageImages.aboutStory} sizes="(max-width: 900px) 94vw, 66vw" />
        </div>
      </section>

      <section className="about-page-section about-page-principles" aria-labelledby="about-principles-title">
        <div className="about-page-section-head">
          <p className="eyebrow">How we work</p>
          <h2 id="about-principles-title">A simple way to do meaningful work.</h2>
        </div>
        <div className="about-page-principles-grid">
          {aboutPage.approach.map((item) => (
            <article className="about-page-principle" key={item.number}>
              <span className="eyebrow">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page-section about-page-direction" aria-labelledby="about-direction-title">
        <div className="about-page-section-head">
          <p className="eyebrow">What guides us</p>
          <h2 id="about-direction-title">Built to rise above.</h2>
        </div>
        <div className="about-page-direction-grid">
          <div><h3>Our vision</h3><p>{about.vision}</p></div>
          <div><h3>Our mission</h3><p>{about.mission}</p></div>
        </div>
      </section>

      <section className="about-page-section about-page-team" id="team" aria-labelledby="about-team-title">
        <div className="about-page-team-heading">
          <div className="about-page-section-head">
            <p className="eyebrow">The people behind the work</p>
            <h2 id="about-team-title">Meet the team.</h2>
          </div>
          <p className="about-page-sample-note">{aboutPage.teamNote}</p>
        </div>
        <div className="about-page-team-grid">
          {aboutPage.team.map((person) => (
            <article className="about-page-person" key={person.name}>
              <img src={person.image} width="720" height="900" alt={`Sample portrait for ${person.name}`} loading="lazy" decoding="async" />
              <div className="about-page-person-copy">
                <p className="eyebrow">Sample profile</p>
                <h3>{person.name}</h3>
                <p className="about-page-person-role">{person.role}</p>
                <p>{person.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page-section about-page-location" aria-labelledby="about-location-title">
        <div className="about-page-section-head">
          <p className="eyebrow">Where to find us</p>
          <h2 id="about-location-title">Connected across India.</h2>
          <p>We work with businesses across India. For now, the best place to reach us is online.</p>
        </div>
        <div className="about-page-location-details">
          <div className="about-page-location-item">
            <h3>Get in touch</h3>
            <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a>
            <a href={contactLinks.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {contactLinks.whatsappNumber}</a>
          </div>
          <div className="about-page-location-item about-page-sample-address">
            <h3>{aboutPage.sampleAddress.label}</h3>
            <div className="about-page-address-lines">{aboutPage.sampleAddress.lines.map((line) => <span key={line}>{line}</span>)}</div>
            <p>{aboutPage.sampleAddress.note}</p>
          </div>
        </div>
      </section>

      <section className="about-page-cta" aria-labelledby="about-cta-title">
        <div><p className="eyebrow">Your next move</p><h2 id="about-cta-title">Let’s make something matter.</h2></div>
        <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
      </section>
    </ServicePageLayout>
  )
}
