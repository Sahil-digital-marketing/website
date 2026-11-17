import { ArrowIcon } from '../../components/ArrowIcon'
import { HeroArt } from '../../components/HeroArt'

export function HeroSection() {
  return (
    <section className="hero section" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> STRATEGY. CREATIVITY. TECHNOLOGY.</p>
        <h1 id="hero-title">Transforming<br />digital presence.<br /><em>Into progress.</em></h1>
        <p className="hero-summary">Digital marketing and websites for businesses ready to move forward. Built on clear thinking. Made for your next chapter.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">Start a Project <ArrowIcon /></a>
          <a className="text-link" href="#services">Explore our services <ArrowIcon direction="down" /></a>
        </div>
        <div className="hero-proof">
          <span className="proof-icon" aria-hidden="true">✓</span>
          <span>Udyam Registered <span className="proof-detail">/ MSME</span></span>
          <span className="proof-divider" />
          <span>Serving businesses across India.</span>
        </div>
      </div>
      <HeroArt />
      <div className="hero-bottom"><span>SIGNATURE OF SUCCESS.</span><a href="#services">SCROLL TO EXPLORE <ArrowIcon direction="down" /></a></div>
    </section>
  )
}
