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
      console.log('getCurrentUser: No token found, skipping API call')
      return null
    }

    // Use mock implementation if feature flag is enabled
    if (FEATURES.MOCK_AUTH) {
      console.log('getCurrentUser: Using mock auth service')
      return mockGetCurrentUser()
    }

    console.log('getCurrentUser: Fetching user data from API')

    // Make API call to get user data
    const response = await fetch(AUTH_ENDPOINTS.ME, {
      ...getDefaultFetchOptions(true),
    })

    if (!response.ok) {
      // If unauthorized, clear token and return null
      if (response.status === 401) {
        console.log('getCurrentUser: Unauthorized access, clearing tokens')
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

    // Parse and validate user data
    const userData = await response.json()
    console.log('getCurrentUser: Successfully fetched user data')

    return userData
  } catch (error) {
    console.error('Error fetching current user:', error)
    // Don't automatically clear tokens on network errors
    // to avoid logging out users due to temporary API issues
    if (error instanceof Response && error.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    return null
  }
}
