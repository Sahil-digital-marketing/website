import { useLayoutEffect, useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { HeroArt } from '../../components/HeroArt'
import { fieldNotes, type FieldNote } from '../../data/landing'
import { easeOut, gsap, prefersReducedMotion, SplitText } from '../../lib/motion'

type HeroSectionProps = {
  onOpenNote: (note: FieldNote) => void
}

export function HeroSection({ onOpenNote }: HeroSectionProps) {
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
        .from('.hero-card', { autoAlpha: 0, y: 32, duration: 0.9, stagger: 0.12, ease: easeOut }, '-=0.5')
    }, copy.parentElement ?? copy)
    return () => {
      context.revert()
      split?.revert()
    }
  }, [])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <HeroArt />
      <div className="hero-copy" ref={copyRef}>
        <h1 id="hero-title">Growth, signed and delivered.</h1>
        <p className="hero-summary">SAHIL Digital Marketing plans and runs social, search, ads, content and websites for businesses across India.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">Start a Project <ArrowIcon /></a>
          <a className="text-link" href="#explore">See what we do <ArrowIcon direction="down" /></a>
        </div>
      </div>
      <div className="hero-cards">
        {fieldNotes.slice(0, 2).map((note) => (
          <button className="hero-card" type="button" key={note.id} onClick={() => onOpenNote(note)}>
            <img src={note.image.src.replace('/1200/900', '/420/280')} width="420" height="280" alt={note.image.alt} />
            <span className="hero-card-title">{note.title}<ArrowIcon /></span>
          </button>
        ))}
      </div>
    </section>
  )
}
