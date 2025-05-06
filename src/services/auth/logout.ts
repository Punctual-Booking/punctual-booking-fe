import { AUTH_ENDPOINTS, getDefaultFetchOptions } from '@/config/api'
import { FEATURES } from '@/config'
import { mockLogout } from '@/mocks/mockAuthService'

export const logout = async (): Promise<void> => {
  try {
    // Use mock implementation if feature flag is enabled
    if (FEATURES.MOCK_AUTH) {
      console.log('Using mock auth service for logout')
      return mockLogout()
    }

    // Remove token from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Call logout endpoint if needed
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      ...getDefaultFetchOptions(true),
    })

    if (!response.ok) {
      console.warn('Logout API call failed, but tokens were removed locally')
    }
  } catch (error) {
    console.error('Logout error:', error)
    // We still want to clear local tokens even if the API call fails
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}
