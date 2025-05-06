import { User } from '@/types/auth'
import { AUTH_ENDPOINTS, getDefaultFetchOptions } from '@/config/api'
import i18next from 'i18next'
import { FEATURES } from '@/config'
import { mockRegister } from '@/mocks/mockAuthService'

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string // Note: This is pre-hashed for transport security
  confirmPassword: string // Note: This is pre-hashed for transport security
}

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<User> => {
  try {
    // Use mock implementation if feature flag is enabled
    if (FEATURES.MOCK_AUTH) {
      console.log('Using mock auth service for registration')
      return mockRegister(
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation
      )
    }

    // Client-side validation
    if (password !== passwordConfirmation) {
      throw new Error(
        i18next.t('auth.errors.passwordMismatch', { ns: 'common' })
      )
    }

    // Hash passwords before transmitting
    const hashedPassword = password //await hashPasswords(password) for testing
    const hashedConfirmPassword = passwordConfirmation //await hashPasswords(passwordConfirmation) for testing
    // const { hashedPassword, hashedConfirmPassword } = await hashPasswords(
    //   password,
    //   passwordConfirmation
    // )

    // Build request payload with hashed passwords
    const requestData: RegisterRequest = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    }

    // Make API call
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
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
        // Extract the exact message from the backend
        errorMessage =
          errorData.title ||
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          // If response is a raw string (like "Username already exists.")
          (typeof errorData === 'string' ? errorData : null) ||
          i18next.t('auth.errors.registrationFailed', { ns: 'common' })
      } catch {
        // If response is not JSON, try to get the raw text
        try {
          const text = await response.text()
          errorMessage =
            text ||
            i18next.t('auth.errors.registrationFailed', { ns: 'common' })
        } catch {
          errorMessage = i18next.t('auth.errors.registrationFailed', {
            ns: 'common',
          })
        }
      }

      throw new Error(errorMessage)
    }

    // Parse successful response
    const userData = await response.json()

    return userData
  } catch (error) {
    console.error('Registration error:', error)
    throw error instanceof Error
      ? error
      : new Error(i18next.t('auth.errors.registrationFailed', { ns: 'common' }))
  }
}
