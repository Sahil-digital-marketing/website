'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { readEnquirySelection } from '../lib/enquirySelection'
import { services } from '../data/landing'
import { customDevelopment } from '../data/customDevelopment'
import { findWebsitePackage } from '../data/websitePackages'

export type EnquirySelection = { service: string, packageId?: string }

const EnquiryContext = createContext<{
  selection: EnquirySelection
  select: (selection: EnquirySelection) => void
} | null>(null)

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<EnquirySelection>({ service: '' })
  useEffect(() => setSelection(readEnquirySelection()), [])

  function select(next: EnquirySelection) {
    const service = next.service === customDevelopment.id
      ? 'web'
      : services.some(item => item.id === next.service) ? next.service : ''
    const packageId = service === 'web'
      ? next.service === customDevelopment.id || next.packageId === customDevelopment.packageId
        ? customDevelopment.packageId
        : findWebsitePackage(next.packageId ?? null)?.id
      : undefined
    setSelection({ service, packageId })
  }

  return <EnquiryContext.Provider value={{ selection, select }}>{children}</EnquiryContext.Provider>
}

export function useEnquiry() {
  const context = useContext(EnquiryContext)
  if (!context) throw new Error('Enquiry components require EnquiryProvider')
  return context
}
