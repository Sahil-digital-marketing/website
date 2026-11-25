import { useRef, type KeyboardEvent } from 'react'
import { ArrowIcon } from '../../components/ArrowIcon'
import { EditorialImage } from '../../components/EditorialImage'
import { services } from '../../data/landing'
import { useReveal } from '../../lib/useReveal'

type ServiceExplorerProps = {
  selectedId: string
  onSelect: (serviceId: string) => void
}

/* The page's live thing: pick a service, read exactly what it includes and how
   the work runs, then start an enquiry with that service already chosen. */
export function ServiceExplorer({ selectedId, onSelect }: ServiceExplorerProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  useReveal(sectionRef)
  const selected = services.find((service) => service.id === selectedId) ?? services[0]

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    let next = index
    if (event.key in keys) next = (index + keys[event.key] + services.length) % services.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = services.length - 1
    else return
    event.preventDefault()
    onSelect(services[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="section explorer" id="explore" aria-labelledby="explore-title" ref={sectionRef}>
      <div className="explorer-head" data-reveal-group>
        <h2 id="explore-title" data-reveal>
          <span className="explorer-soft">Pick a service.</span>
          <span>See what you get.</span>
        </h2>
      </div>
      <div className="explorer-body">
        <div className="explorer-tabs" role="tablist" aria-label="Services" aria-orientation="vertical">
          {services.map((service, index) => {
            const isSelected = service.id === selected.id
            return (
              <button
                key={service.id}
                ref={(element) => { tabRefs.current[index] = element }}
                className="explorer-tab"
                type="button"
                role="tab"
                id={`tab-${service.id}`}
                aria-selected={isSelected}
                aria-controls="explorer-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelect(service.id)}
                onKeyDown={(event) => onTabKey(event, index)}
              >
                {service.title}
              </button>
            )
          })}
        </div>
        <div className="explorer-panel" id="explorer-panel" role="tabpanel" aria-labelledby={`tab-${selected.id}`} key={selected.id}>
          <div className="explorer-details">
            <p className="explorer-tagline">{selected.tagline}</p>
            <ul className="explorer-bands" aria-label={`Included in ${selected.title}`}>
              {selected.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="explorer-overview">
            <EditorialImage className="explorer-image" image={selected.image} sizes="(max-width: 600px) 92vw, 32vw" />
            <div className="explorer-foot">
              <div>
                <h3>How the work runs</h3>
                <ol className="explorer-steps">
                  {selected.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
              <div>
                <h3>Best for</h3>
                <p>{selected.bestFor}</p>
              </div>
            </div>
            <a className="button button-primary explorer-start" href={selected.href}>
              View {selected.title} <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
