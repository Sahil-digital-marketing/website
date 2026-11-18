import { useRef } from 'react'
import { faqs } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title" ref={sectionRef}>
      <h2 id="faq-title">Questions, answered.</h2>
      <div className="faq-text" data-reveal-group>
        {faqs.map((faq) => (
          <p className="faq-item" key={faq.question} data-reveal>
            <strong>{faq.question}</strong> {faq.answer}
          </p>
        ))}
      </div>
    </section>
  )
}
