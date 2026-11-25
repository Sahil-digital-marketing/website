import { useRef } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EditorialImage } from '../../components/EditorialImage'
import { SectionPhoto } from '../../components/SectionPhoto'
import { homeImages } from '../../data/homeImages'
import { fieldNotes, type FieldNote } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

type FieldNotesSectionProps = {
  onOpenNote: (note: FieldNote) => void
}

export function FieldNotesSection({ onOpenNote }: FieldNotesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef)

  return (
    <section className="colour-page notes photo-field" id="notes" aria-labelledby="notes-title" ref={sectionRef}>
      <div className="section notes-inner">
        <div className="notes-head" data-reveal-group>
          <h2 id="notes-title" data-reveal>Field notes from the studio.</h2>
          <p data-reveal>Short reads on the moves, messages and measures that help ambitious brands stand out.</p>
        </div>
        <ul className="notes-mosaic" data-reveal-group>
          {fieldNotes.map((note, index) => (
            <li className={`note-tile note-tile--${index + 1}`} key={note.id} data-reveal>
              <button type="button" onClick={() => onOpenNote(note)}>
                <EditorialImage image={note.image} sizes="(max-width: 760px) 92vw, 48vw" />
                <span className="note-bar">
                  <span className="note-topic">{note.topic}, {note.readTime}</span>
                  <span className="note-title">{note.title}</span>
                  <ArrowIcon />
                </span>
              </button>
            </li>
          ))}
          <li className="note-tile note-tile--field photo-field" aria-hidden="true" data-reveal>
            <SectionPhoto image={homeImages.web} />
            <span>Less noise. More momentum.</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
