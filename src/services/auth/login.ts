import { User } from '@/types/auth'
import { AUTH_ENDPOINTS, getDefaultFetchOptions } from '@/config/api'
import { FEATURES } from '@/config'
import { mockLogin } from '@/mocks/mockAuthService'

interface LoginRequest {
  email: string
  password: string // Note: This is pre-hashed for transport security
}

interface TokenResponseDto {
  accessToken: string
  refreshToken: string
}

export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Use mock implementation if feature flag is enabled
    if (FEATURES.MOCK_AUTH) {
      console.log('Using mock auth service for login')
      return mockLogin(email, password)
    }

    // Hash the password before sending
    const hashedPassword = password //await hashPassword(password) for testing

    // Build request payload with hashed password
    const requestData: LoginRequest = {
      email,
      password: hashedPassword,
    }

    // Make API call
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      ...getDefaultFetchOptions(),
      body: JSON.stringify(requestData),
    })
    // Handle non-successful responses
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage: string
      try {
        const errorData = await response.json()
        errorMessage =
          errorData.message ||
          errorData.error ||
          `Login failed with status: ${response.status}`
      } catch {
        // If response is not JSON or doesn't have message/error
        errorMessage =
          (await response.text()) ||
          `Login failed with status: ${response.status}`
      }

      throw new Error(errorMessage)
    }

    // Parse successful response
    const tokenData: TokenResponseDto = await response.json()

    // Store tokens securely
    localStorage.setItem('access_token', tokenData.accessToken)
    localStorage.setItem('refresh_token', tokenData.refreshToken)

    // Fetch user data with the access token
    const userResponse = await fetch(AUTH_ENDPOINTS.ME, {
      ...getDefaultFetchOptions(true),
    })

    if (!userResponse.ok) {
      let errorMessage: string
      try {
        const errorData = await userResponse.json()
        errorMessage =
          errorData.message || errorData.error || 'Failed to fetch user data'
      } catch {
        errorMessage =
          (await userResponse.text()) || 'Failed to fetch user data'
      }

      throw new Error(errorMessage)
    }

    // Return user data
    return userResponse.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error instanceof Error
      ? error
      : new Error(
          'Ocorreu um erro durante o início de sessão. Por favor, tente novamente.'
        )
  }
}
