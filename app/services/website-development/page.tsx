import type { Metadata } from 'next'
import { WebsiteDevelopmentPage } from '../../../src/screens/WebsiteDevelopmentPage'
import { pageMetadata } from '../../../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/services/website-development']
export default function Page() { return <WebsiteDevelopmentPage /> }
