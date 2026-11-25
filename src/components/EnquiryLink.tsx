import type { ComponentProps } from 'react'
import { useEnquiry } from './EnquiryContext'

type EnquiryLinkProps = Omit<ComponentProps<'a'>, 'href'> & { service?: string, packageId?: string }

export function EnquiryLink({ service, packageId, onClick, children, ...props }: EnquiryLinkProps) {
  const { select, selection } = useEnquiry()
  const next = service ? { service, packageId } : selection
  const query = new URLSearchParams()
  if (next.service) query.set('service', next.service)
  if (next.packageId) query.set('package', next.packageId)
  const href = `${window.location.pathname}${query.size ? `?${query}` : ''}#contact`

  return <a {...props} href={href} onClick={event => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (service) select({ service, packageId })
    // Keep the page and the form mounted so changing a package preserves typed details.
    history.replaceState(null, '', href)
    document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }}>{children}</a>
}
