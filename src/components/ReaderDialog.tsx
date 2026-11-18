import { useEffect, useRef } from 'react'
import type { FieldNote } from '../data/landing'
import { ArrowIcon } from './ArrowIcon'

type ReaderDialogProps = {
  note: FieldNote | null
  onClose: () => void
}

/* Native <dialog>: focus trapping, Escape and focus return come from the platform. */
export function ReaderDialog({ note, onClose }: ReaderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (note && !dialog.open) dialog.showModal()
    if (!note && dialog.open) dialog.close()
  }, [note])

  return (
    <dialog
      ref={dialogRef}
      className="reader"
      aria-labelledby="reader-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      {note && (
        <article className="reader-panel">
          <img className="reader-image" src={note.image.src.replace('/1200/900', '/1200/560')} width="1200" height="560" alt={note.image.alt} />
          <div className="reader-copy">
            <p className="reader-meta">{note.topic}, {note.readTime}</p>
            <h2 id="reader-title">{note.title}</h2>
            <p className="reader-summary">{note.summary}</p>
            <p>{note.body}</p>
            <a className="text-link" href="#contact" onClick={onClose}>Put this into action <ArrowIcon /></a>
          </div>
          <button className="reader-close" type="button" onClick={onClose} aria-label="Close article">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
          </button>
        </article>
      )}
    </dialog>
  )
}
