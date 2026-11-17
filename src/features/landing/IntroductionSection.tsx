import { ArrowIcon } from '../../components/ArrowIcon'

export function IntroductionSection() {
  return (
    <section className="section introduction-section" aria-labelledby="introduction-title">
      <div className="section-label"><span>01 / THE BIGGER PICTURE</span></div>
      <div className="introduction-copy">
        <h2 id="introduction-title">Your business has ambition.<br /><span className="muted-heading">Give it a clear direction.</span></h2>
        <div className="introduction-bottom">
          <p>SAHIL brings marketing strategy, creative execution, and website development together. We start with what your business needs, then build the digital presence to support it.</p>
          <a className="text-link" href="#approach">How we work <ArrowIcon /></a>
        </div>
      </div>
    </section>
  )
}
