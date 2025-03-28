import { RouterProvider } from '@tanstack/react-router'
import '@/styles/globals.css'
import { useAuth } from '@/hooks/auth'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Loading } from '@/components/ui/loading'
import { router } from '@/router'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <Loading centered className="h-screen" size="lg" />
  }

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
