import { useRef } from 'react'
import { processSteps } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'
import { ArrowIcon } from '../../components/ArrowIcon'

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="section process" id="process" aria-labelledby="process-title" ref={sectionRef}>
      <div className="process-heading-row">
        <h2 id="process-title" className="process-heading">How we work</h2>
        <a className="text-link" href="/process">Explore our process <ArrowIcon /></a>
      </div>
      <ol className="process-steps" data-reveal-group>
        {processSteps.map((step, index) => (
          <li className="process-step" key={step.line} data-reveal>
            <span className="process-number" aria-hidden="true">0{index + 1}</span>
            <div>
              <h3 className="process-line">{step.line}</h3>
              <p className="process-detail">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
