import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'
import '@/lib/i18n.ts'
import 'flag-icons/css/flag-icons.min.css'
import { router } from './router'
import './styles/globals.css'

// Initialize the router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Make sure the router is ready before mounting
const initializeApp = async () => {
  // Wait for the router to be ready
  await router.load().catch(error => {
    console.error('Failed to load router:', error)
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SpeedInsights />
      <RouterProvider router={router} />
    </StrictMode>
  )
}

initializeApp()
