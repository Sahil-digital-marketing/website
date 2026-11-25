import type { HomeImage } from '../data/homeImages'

export function SectionPhoto({ image, eager = false }: { image: HomeImage, eager?: boolean }) {
  return (
    <div className="section-photo" aria-hidden="true">
      <img {...image} alt="" sizes="100vw" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  )
}
