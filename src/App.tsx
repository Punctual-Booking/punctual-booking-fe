import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/providers/QueryProvider'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { useEffect } from 'react'
import { FEATURES } from './config'

function App() {
  useEffect(() => {
    // Initialize mock data if needed for development
    if (FEATURES.MOCK_AUTH && !localStorage.getItem('access_token')) {
      console.log('Initializing mock authentication data')
      localStorage.setItem('access_token', 'mock-jwt-token')
      localStorage.setItem('refresh_token', 'mock-refresh-token')
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <QueryProvider>
          <div className="min-h-screen">
            <Outlet />
            <Toaster />
          </div>
        </QueryProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
