import { ReactNode, useEffect, useState, useRef } from 'react'
import { getCurrentUser } from '@/services/auth/me'
import { queryClient } from '@/lib/queryClient'
import { Loading } from '@/components/ui/loading'
import { FEATURES } from '@/config'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider is responsible for initializing the authentication state
 * and providing it to the rest of the application.
 *
 * It handles:
 * 1. Initial auth state setup (including mock auth if enabled)
 * 2. Loading user data exactly once at app startup
 * 3. Setting the user data in the React Query cache
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const initializationAttempted = useRef(false)

  useEffect(() => {
    // Avoid multiple initialization attempts
    if (initializationAttempted.current) return
    initializationAttempted.current = true

    const initializeAuth = async () => {
      try {
        // Clear any existing tokens first to force a fresh login
        console.log('AuthProvider: Clearing existing tokens for fresh login')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        // Check if user data is already in cache first
        const cachedUser = queryClient.getQueryData(['user'])
        if (cachedUser) {
          console.log(
            'AuthProvider: User data already in cache, skipping fetch'
          )
          setIsInitializing(false)
          return
        }

        // Initialize mock data if needed for development
        if (FEATURES.MOCK_AUTH && !localStorage.getItem('access_token')) {
          console.log('AuthProvider: Setting up mock auth tokens')
          localStorage.setItem('access_token', 'mock-jwt-token-admin')
          localStorage.setItem('refresh_token', 'mock-refresh-token')
        }

        // Get the token
        const token = localStorage.getItem('access_token')

        // Only attempt to fetch user data if token exists
        if (token) {
          console.log('AuthProvider: Fetching user data during initialization')
          const userData = await getCurrentUser()

          if (userData) {
            console.log('AuthProvider: User data fetched successfully')
            // Set the data in the cache for React Query
            queryClient.setQueryData(['user'], userData)
          } else {
            // If we have a token but couldn't get user data, clear the tokens
            console.log('AuthProvider: No user data returned, clearing tokens')
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            queryClient.setQueryData(['user'], null)
          }
        } else {
          console.log('AuthProvider: No token found, setting user to null')
          queryClient.setQueryData(['user'], null)
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing auth:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        queryClient.setQueryData(['user'], null)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()

    // This effect should only run once at app initialization
  }, [])

  // Show loading indicator while initializing auth
  if (isInitializing) {
    return <Loading centered text="Initializing application..." />
  }

  return <>{children}</>
}
