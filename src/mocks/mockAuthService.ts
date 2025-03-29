import { User, UserRole } from '@/types/auth'

// Mock user data
const mockUser: User = {
  id: 'mock-user-id',
  name: 'John Doe',
  email: 'user@example.com',
  role: UserRole.CUSTOMER,
}

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock login function
 * Simulates authentication with mock user data
 */
export const mockLogin = async (
  email: string,
  password: string
): Promise<User> => {
  console.log('Mock: Login attempt', { email })

  // Simulate network delay
  await delay(800)

  // Mock validation
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  // For demo, accept any non-empty credentials
  // In a real implementation, this would validate against stored credentials
  if (email && password) {
    // Store a fake token in localStorage for persistence
    localStorage.setItem('access_token', 'mock-jwt-token')
    localStorage.setItem('refresh_token', 'mock-refresh-token')

    // Return mock user with provided email
    return {
      ...mockUser,
      email,
    }
  }

  throw new Error('Invalid credentials')
}

/**
 * Mock register function
 * Simulates user registration
 */
export const mockRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<User> => {
  console.log('Mock: Register attempt', { firstName, lastName, email })

  // Simulate network delay
  await delay(1000)

  // Mock validation
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  if (password !== passwordConfirmation) {
    throw new Error('Passwords do not match')
  }

  // Store a fake token in localStorage for persistence
  localStorage.setItem('access_token', 'mock-jwt-token')
  localStorage.setItem('refresh_token', 'mock-refresh-token')

  // Return mock user with registered data
  return {
    ...mockUser,
    name: `${firstName} ${lastName}`,
    email,
  }
}

/**
 * Mock logout function
 */
export const mockLogout = async (): Promise<void> => {
  console.log('Mock: Logout')

  // Simulate network delay
  await delay(500)

  // Clear tokens
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

/**
 * Mock get current user function
 */
export const mockGetCurrentUser = async (): Promise<User | null> => {
  console.log('Mock: Get current user')

  // Simulate network delay
  await delay(300)

  // Check if we have a token (simulating authenticated state)
  const hasToken = !!localStorage.getItem('access_token')

  if (hasToken) {
    return mockUser
  }

  return null
}
