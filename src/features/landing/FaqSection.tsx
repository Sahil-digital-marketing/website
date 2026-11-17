import { faqs } from '../../data/landing'

export function FaqSection() {
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-heading">
        <p className="section-label">04 / BEFORE WE BEGIN</p>
        <h2 id="faq-title">A little{' '}<br /><span className="muted-heading">more clarity.</span></h2>
        <p>Good partnerships start with the right questions.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>{faq.question}<span className="faq-plus" aria-hidden="true" /></summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
