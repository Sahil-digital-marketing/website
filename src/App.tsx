import { LandingPage } from './pages/LandingPage'

const pagesByPath = {
  '/': LandingPage,
}

export default function App() {
  const Page = pagesByPath[window.location.pathname as keyof typeof pagesByPath] ?? LandingPage

  return <Page />
}
