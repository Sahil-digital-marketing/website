import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../src/styles.css'
import { EnquiryProvider } from '../src/components/EnquiryContext'

export const metadata: Metadata = {
  title: 'SAHIL Digital Marketing',
  description: 'The signature of success.',
  openGraph: { images: ['/brand/og-image.jpg'] },
  icons: { icon: '/brand/sahil-mark.webp' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "try{let t=localStorage.getItem('sahil-theme');document.documentElement.classList.toggle('dark',t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))}catch{}" }} /></head><body><EnquiryProvider>{children}</EnquiryProvider></body></html>
}
