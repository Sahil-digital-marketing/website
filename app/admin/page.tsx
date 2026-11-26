import type { Metadata } from 'next'
import { isAdmin } from '../../server/security'
import { AdminApp } from '../../src/components/AdminApp'

export const runtime = 'edge'
export const metadata: Metadata = { title: 'Enquiries | SAHIL Admin', robots: { index: false, follow: false } }

export default async function AdminPage() {
  return <AdminApp signedIn={await isAdmin()} />
}
