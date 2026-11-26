import type { Metadata } from 'next'
import { ProcessPage } from '../../src/screens/ProcessPage'
import { pageMetadata } from '../../src/data/pageMetadata'

export const metadata: Metadata = pageMetadata['/process']
export default function Page() { return <ProcessPage /> }
