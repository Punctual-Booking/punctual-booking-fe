import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { useEffect } from 'react'
import { FEATURES } from '@/config'
import { mockGetCurrentUser } from '@/mocks/mockAuthService'
import { getCurrentUser } from '@/services/auth/me'

export interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  useEffect(() => {
    // Initialize user data in the cache if authenticated
    const token = localStorage.getItem('access_token')
    if (token) {
      const loadUser = async () => {
        try {
          console.log('QueryProvider - Initializing user data in cache')
          const userData = await getCurrentUser()
          if (userData) {
            console.log('QueryProvider - Setting user data in cache:', userData)
            queryClient.setQueryData(['user'], userData)
          } else {
            console.log('QueryProvider - No user data found')
          }
        } catch (error) {
          console.error('QueryProvider - Error loading user:', error)
        }
      }

      loadUser()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
