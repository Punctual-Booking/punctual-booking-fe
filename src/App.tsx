import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/providers/QueryProvider'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'

/**
 * Main App component that sets up all providers:
 * - I18nextProvider for translations
 * - ThemeProvider for themes
 * - AuthProvider for authentication (new, centralized auth)
 * - QueryProvider for data fetching
 */
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AuthProvider>
          <QueryProvider>
            <div className="min-h-screen">
              <Outlet />
              <Toaster />
            </div>
          </QueryProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
