import { navigationLinks, services } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'
import { Brand } from './Brand'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>Strategy, creativity, and technology.<br />A considered way forward.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <span className="footer-label">EXPLORE</span>
            {navigationLinks.map((link) => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="footer-services">
            <span className="footer-label">OUR EXPERTISE</span>
            {services.map((service) => (
              <a href="#services" key={service.title}>{service.title}</a>
            ))}
          </div>
          <a className="back-to-top" href="#top" aria-label="Back to top">
            <ArrowIcon />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SAHIL Digital Marketing</span>
          <span>Signature of Success.</span>
          <span>INDIA</span>
        </div>
      </div>
    </footer>
  )
}
