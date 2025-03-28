import { User, UserRole } from '@/types/auth'
import { mockAdminUser, mockStaffUser, mockCustomerUser } from './mockUser'

// Flag to enable/disable mock mode
const MOCK_ENABLED = true
// Mock user type - change this value to test different user roles
const MOCK_USER_TYPE = UserRole.ADMIN

/**
 * Mock implementation of the login endpoint
 */
export const mockLogin = async (
  email: string,
  password: string
): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log('Mock login service called with:', {
    email,
    password: '[HASHED]',
  })

  // Store tokens in localStorage to simulate real login
  localStorage.setItem('access_token', 'mock_access_token')
  localStorage.setItem('refresh_token', 'mock_refresh_token')

  // Return mock user data based on selected role
  if (MOCK_USER_TYPE === UserRole.ADMIN) {
    return { ...mockAdminUser }
  } else if (MOCK_USER_TYPE === UserRole.STAFF) {
    return { ...mockStaffUser }
  } else {
    return { ...mockCustomerUser }
  }
}

/**
 * Mock implementation of the register endpoint
 */
export const mockRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  console.log('Mock register service called with:', {
    firstName,
    lastName,
    email,
    password: '[HASHED]',
    passwordConfirmation: '[HASHED]',
  })

  // Just return the mock customer user
  const mockUser = {
    ...mockCustomerUser,
    name: `${firstName} ${lastName}`,
    email,
  }

  return mockUser
}

/**
 * Mock implementation of the me endpoint
 */
export const mockGetCurrentUser = async (): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Check if mock tokens exist (user is "logged in")
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('Not authenticated')
  }

  // Return mock user data based on selected role
  if (MOCK_USER_TYPE === UserRole.ADMIN) {
    return { ...mockAdminUser }
  } else if (MOCK_USER_TYPE === UserRole.STAFF) {
    return { ...mockStaffUser }
  } else {
    return { ...mockCustomerUser }
  }
}

/**
 * Mock implementation of the logout endpoint
 */
export const mockLogout = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Remove tokens from localStorage
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  console.log('Mock logout service called')

  return
}
