import type { ReactNode } from 'react'
import type { ServiceIconName } from '../data/landing'

type ServiceIconProps = {
  name: ServiceIconName
}

export function ServiceIcon({ name }: ServiceIconProps) {
  const paths: Record<ServiceIconName, ReactNode> = {
    social: <><circle cx="12" cy="12" r="3" /><path d="M4.5 8.5 8.5 6M15.5 6l4 2.5M4.5 15.5 8.5 18M15.5 18l4-2.5" /></>,
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5M7.5 10.5h6M10.5 7.5v6" /></>,
    ads: <><path d="M5 15.5V8.8l12-4v14.4L5 15.5Z" /><path d="M17 9.2 20 7v10l-3-2.2M8 16l1.2 4h3" /></>,
    content: <><path d="M5 4.5h14v15H5zM8 8h8M8 12h8M8 16h4" /></>,
    analytics: <><path d="M5 19V11M10 19V5M15 19V9M20 19V3" /><path d="m5 8 5-4 5 3 5-4" /></>,
    web: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 7h.01M10 7h.01M9 14l2 2 4-4" /></>,
  }

  return <svg className="service-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}
