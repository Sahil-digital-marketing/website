import type { HomeImage } from '../data/homeImages'

type EditorialImageProps = {
  image: HomeImage
  sizes: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export function EditorialImage({ image, sizes, className, loading = 'lazy' }: EditorialImageProps) {
  return <img {...image} sizes={sizes} className={className} loading={loading} decoding="async" />
}
