import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { EnquiryProvider } from './components/EnquiryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnquiryProvider><App /></EnquiryProvider>
  </StrictMode>,
)
