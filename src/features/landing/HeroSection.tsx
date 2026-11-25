import { useLayoutEffect, useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EnquiryLink } from '../../components/EnquiryLink'
import { HeroArt } from '../../components/HeroArt'
import { EditorialImage } from '../../components/EditorialImage'
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
        <h1 id="hero-title">The signature of success.</h1>
        <p className="hero-summary">We turn bold ideas into magnetic digital experiences — combining strategy, creativity and technology to move your business forward.</p>
        <div className="hero-actions">
          <EnquiryLink className="button button-primary">Start a Project <ArrowIcon /></EnquiryLink>
          <a className="text-link" href="#explore">See what we do <ArrowIcon direction="down" /></a>
        </div>
      </div>
      <div className="hero-cards">
        {fieldNotes.slice(0, 2).map((note) => (
          <button className="hero-card" type="button" key={note.id} onClick={() => onOpenNote(note)}>
            <EditorialImage image={note.image} sizes="(max-aspect-ratio: 21/20) 45vw, (max-width: 1200px) 180px, 230px" loading="eager" />
            <span className="hero-card-title">{note.title}<ArrowIcon /></span>
          </button>
        ))}
      </div>
    </section>
  )
}
