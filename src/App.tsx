import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { WebsiteDevelopmentPage } from './pages/WebsiteDevelopmentPage'
import { DigitalGrowthPage } from './pages/DigitalGrowthPage'
import { ProcessPage } from './pages/ProcessPage'
import { useLayoutEffect } from 'react'
import { pageMetadata } from './data/pageMetadata'

const pagesByPath = {
  '/': LandingPage,
  '/about': AboutPage,
  '/services': ServicesPage,
  '/services/website-development': WebsiteDevelopmentPage,
  '/services/digital-growth': DigitalGrowthPage,
  '/process': ProcessPage,
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const Page = pagesByPath[path as keyof typeof pagesByPath] ?? LandingPage

  useLayoutEffect(() => {
    const metadata = pageMetadata[path] ?? pageMetadata['/']
    document.title = metadata.title
    for (const name of ['og:title', 'twitter:title']) document.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.setAttribute('content', metadata.title)
    for (const name of ['description', 'og:description', 'twitter:description']) document.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.setAttribute('content', metadata.description)
  }, [path])

  return <Page />
}
