import { useLayoutEffect, useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EnquiryLink } from '../../components/EnquiryLink'
import { HeroArt } from '../../components/HeroArt'
import { easeOut, gsap, prefersReducedMotion, SplitText } from '../../lib/motion'
import { IntroSequence } from '../../components/IntroSequence'
import { SectionPhoto } from '../../components/SectionPhoto'
import { homeImages } from '../../data/homeImages'

export function HeroSection() {
  const copyRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const copy = copyRef.current
    if (!copy || prefersReducedMotion()) return
    let split: SplitText | undefined
    const context = gsap.context(() => {
      split = new SplitText('h1', { type: 'lines,words', mask: 'lines' })
      gsap.timeline({ delay: 0.35 })
        .from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.06, ease: easeOut })
        .from('.hero-summary, .hero-actions', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1, ease: easeOut }, '-=0.7')
    }, copy.parentElement ?? copy)
    return () => {
      context.revert()
      split?.revert()
    }
  }, [])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <IntroSequence />
      <SectionPhoto image={homeImages.hero} eager />
      <div className="hero-grid-glow" aria-hidden="true" />
      <div className="hero-halo hero-halo--one" aria-hidden="true" />
      <div className="hero-halo hero-halo--two" aria-hidden="true" />
      <HeroArt />
      <div className="hero-copy" ref={copyRef}>
        <p className="hero-kicker"><span /> INDEPENDENT DIGITAL GROWTH STUDIO</p>
        <h1 id="hero-title">The signature of success.</h1>
        <p className="hero-summary">We turn bold ideas into magnetic digital experiences — combining strategy, creativity and technology to move your business forward.</p>
        <div className="hero-actions">
          <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
          <a className="text-link" href="#explore">See what we do <ArrowIcon direction="down" /></a>
        </div>
        <div className="hero-proof"><span>✳</span> STRATEGY LED <i /> DESIGN DRIVEN <i /> RESULTS FOCUSED</div>
      </div>
      <div className="hero-bottom-line" aria-hidden="true"><span>SCROLL TO EXPLORE ↓</span><span>CREATIVITY × TECHNOLOGY × GROWTH</span><span>01 / 06</span></div>
    </section>
  )
}
