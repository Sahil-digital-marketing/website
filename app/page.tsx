import type { Metadata } from 'next'
import { LandingPage } from '../src/screens/LandingPage'
import { pageMetadata } from '../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/']
export default function Page() { return <LandingPage /> }
