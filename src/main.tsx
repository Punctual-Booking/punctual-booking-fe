import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import '@/lib/i18n.ts'
import 'flag-icons/css/flag-icons.min.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpeedInsights />
    <App />
  </StrictMode>
)
