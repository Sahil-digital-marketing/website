import { services } from '../data/landing'
import { findWebsitePackage } from '../data/websitePackages'
import { customDevelopment } from '../data/customDevelopment'

export function readEnquirySelection() {
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const requestedService = query.get('service')
  const service = requestedService === customDevelopment.id
    ? 'web'
    : services.some(item => item.id === requestedService) ? requestedService! : ''
  const requestedPackage = query.get('package')
  const packageId = service === 'web'
    ? requestedService === customDevelopment.id || requestedPackage === customDevelopment.packageId
      ? customDevelopment.packageId
      : findWebsitePackage(requestedPackage)?.id
    : undefined
  return { service, packageId }
}
