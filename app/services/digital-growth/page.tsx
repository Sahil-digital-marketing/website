import type { Metadata } from 'next'
import { DigitalGrowthPage } from '../../../src/screens/DigitalGrowthPage'
import { pageMetadata } from '../../../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/services/digital-growth']
export default function Page() { return <DigitalGrowthPage /> }
