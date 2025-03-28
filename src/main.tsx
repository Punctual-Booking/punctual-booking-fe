import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import '@/lib/i18n.ts'
import 'flag-icons/css/flag-icons.min.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { router } from './router'

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
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
}

initializeApp()
