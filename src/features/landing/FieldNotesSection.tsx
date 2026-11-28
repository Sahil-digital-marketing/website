import { useRef, useState } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { fieldNotes, type FieldNote } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'
import { EditorialImage } from '../../components/EditorialImage'

type FieldNotesSectionProps = {
  onOpenNote: (note: FieldNote) => void
}

export function FieldNotesSection({ onOpenNote }: FieldNotesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState('All')
  const topics = ['All', ...new Set(fieldNotes.map(note => note.topic))]
  const visibleNotes = filter === 'All' ? fieldNotes : fieldNotes.filter(note => note.topic === filter)
  useReveal(sectionRef)

  return (
    <section className="colour-page notes" id="notes" aria-labelledby="notes-title" ref={sectionRef}>
      <div className="section notes-inner">
        <div className="notes-head" data-reveal-group>
          <p className="section-kicker">SAHIL / FIELD NOTES · VOL. 01</p>
          <h2 id="notes-title" data-reveal>Make room for<br /><em>better ideas.</em></h2>
          <p data-reveal>Short reads on the moves, messages and measures that help ambitious brands stand out.</p>
        </div>
        <div className="notes-filters" role="group" aria-label="Filter field notes by topic">
          {topics.map(topic => <button type="button" key={topic} className={filter === topic ? 'is-active' : ''} aria-pressed={filter === topic} onClick={() => setFilter(topic)}>{topic}{topic === 'All' && <span> {fieldNotes.length.toString().padStart(2, '0')}</span>}</button>)}
        </div>
        <ul className="notes-mosaic" aria-live="polite">
          {visibleNotes.map((note, index) => (
            <li className={`note-tile note-tile--${index + 1}`} key={note.id} data-reveal>
              <button type="button" onClick={() => onOpenNote(note)}>
                <div className={`note-art note-art--${note.id}`} aria-hidden="true">
                  <EditorialImage image={note.image} sizes="(max-width: 760px) 90vw, (max-width: 1200px) 46vw, 32vw" />
                  <span className="note-art-label">SAHIL / FIELD NOTE 0{fieldNotes.indexOf(note) + 1}</span>
                </div>
                <span className="note-bar">
                  <span className="note-topic">{note.topic}, {note.readTime}</span>
                  <span className="note-title">{note.title}</span>
                  <ArrowIcon />
                </span>
              </button>
            </li>
          ))}
          {filter === 'All' && <li className="note-tile note-tile--field" aria-hidden="true">
            <span>Less noise. More momentum.</span>
          </li>}
        </ul>
      </div>
    </section>
  )
}
