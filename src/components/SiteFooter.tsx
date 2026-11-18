import { contactLinks, navigationLinks, services } from '../data/landing'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-name" aria-hidden="true">SAHIL</p>
      <div className="footer-inner">
        <div className="footer-places">
          <h2 className="visually-hidden">Contact SAHIL Digital Marketing</h2>
          <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a>
          <a href={contactLinks.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {contactLinks.whatsappNumber}</a>
          <a href={contactLinks.instagramHref} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <nav className="footer-column" aria-label="Footer navigation">
          <h3>Explore</h3>
          {navigationLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
        <div className="footer-column">
          <h3>Services</h3>
          {services.map((service) => <a href="#explore" key={service.id}>{service.title}</a>)}
        </div>
        <div className="footer-column">
          <h3>Studio</h3>
          <p>SAHIL Digital Marketing</p>
          <p>Signature of Success.</p>
          <p>Serving businesses across India.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SAHIL Digital Marketing. All rights reserved.</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  )
}
