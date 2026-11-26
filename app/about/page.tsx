import type { Metadata } from 'next'
import { AboutPage } from '../../src/screens/AboutPage'
import { pageMetadata } from '../../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/about']
export default function Page() { return <AboutPage /> }
