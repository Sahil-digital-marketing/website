import { processSteps } from '../../data/landing'

export function ApproachSection() {
  return (
    <section className="approach-band" id="approach" aria-labelledby="approach-title">
      <div className="section approach-section">
        <div className="section-label"><span>03 / THE WAY FORWARD</span></div>
        <div className="section-heading">
          <h2 id="approach-title">Good work starts<br />with <em>clear thinking.</em></h2>
          <p>A shared process keeps your goals in focus, your scope defined, and your next step clear.</p>
        </div>
        <ol className="process-list">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <div className="process-marker"><span>0{index + 1}</span><i aria-hidden="true" /></div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="approach-note">One business goal. A considered strategy. Work that stays connected.</p>
      </div>
    </section>
  )
}
