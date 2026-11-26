import type { Metadata } from 'next'
import { ServicesPage } from '../../src/screens/ServicesPage'
import { pageMetadata } from '../../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/services']
export default function Page() { return <ServicesPage /> }
