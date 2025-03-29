import { User } from '@/types/auth'
import { AUTH_ENDPOINTS, getDefaultFetchOptions } from '@/config/api'
import { FEATURES } from '@/config'
import { mockGetCurrentUser } from '@/mocks/mockAuthService'

/**
 * Fetches the current user's data from the API
 * Used by React Query to populate user data in the cache
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a token first
    const token = localStorage.getItem('access_token')
    if (!token) {
      return null
    }

    // Use mock implementation if feature flag is enabled
    if (FEATURES.MOCK_AUTH) {
      console.log('Using mock auth service for getCurrentUser')
      return mockGetCurrentUser()
    }

    // Make API call to get user data
    const response = await fetch(AUTH_ENDPOINTS.ME, {
      ...getDefaultFetchOptions(true),
    })

    if (!response.ok) {
      // If unauthorized, clear token and return null
      if (response.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return null
      }

      // Handle other errors
      const errorData = await response.json()
      throw new Error(
        errorData.message || `Failed to fetch user data: ${response.status}`
      )
    }

    // Return user data
    return response.json()
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}
