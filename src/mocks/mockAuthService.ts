import { User, UserRole } from '@/types/auth'

// Mock user data
const mockUsers = {
  customer: {
    id: 'mock-user-id',
    name: 'João Silva',
    email: 'customer@example.com',
    role: UserRole.CUSTOMER,
  },
  admin: {
    id: 'mock-admin-id',
    name: 'Maria Oliveira',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  },
  staff: {
    id: 'mock-staff-id',
    name: 'Carlos Santos',
    email: 'staff@example.com',
    role: UserRole.STAFF,
  },
}

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock login function
 * Simulates authentication with mock user data based on the email provided
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

  // For empty password
  if (password.trim() === '') {
    throw new Error('Password cannot be empty')
  }

  // Define which user to return based on the email domain
  let userRole: 'customer' | 'admin' | 'staff' = 'customer'

  // Allow login with special role-based test accounts
  if (email.includes('admin')) {
    userRole = 'admin'
  } else if (email.includes('staff')) {
    userRole = 'staff'
  }

  // Store a fake token in localStorage for persistence
  localStorage.setItem('access_token', `mock-jwt-token-${userRole}`)
  localStorage.setItem('refresh_token', `mock-refresh-token-${userRole}`)

  // Create a custom name if one wasn't provided in the special accounts
  let name = mockUsers[userRole].name

  // If it's a custom email, create a name from it
  if (!email.includes('example.com')) {
    // Extract a name from the email (e.g., john.doe@gmail.com -> John Doe)
    const localPart = email.split('@')[0]
    const nameParts = localPart.split(/[._-]/)
    if (nameParts.length > 0) {
      name = nameParts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    }
  }

  // Return user with the appropriate role and custom data
  return {
    ...mockUsers[userRole],
    email, // Use the provided email
    name, // Use either the default name or one generated from email
  }
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
    ...mockUsers['admin'],
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

  // Clear any mock data stores that should be reset on logout
  // This will ensure that mock data doesn't persist across different user sessions
  try {
    // Dispatch a custom event that mock services can listen for
    window.dispatchEvent(new CustomEvent('mock-logout'))

    console.log('Mock: Dispatched logout event to clear mock data stores')
  } catch (error) {
    console.error('Error dispatching mock logout event:', error)
  }
}

/**
 * Mock get current user function
 */
export const mockGetCurrentUser = async (): Promise<User | null> => {
  // Simulate network delay
  await delay(300)

  // Check if we have a token (simulating authenticated state)
  const token = localStorage.getItem('access_token')
  console.log('Mock: getCurrentUser', { token })
  if (!token) {
    return null
  }

  // Determine user role from token
  let userRole: 'customer' | 'admin' | 'staff' = 'customer'
  if (token.includes('admin')) {
    userRole = 'admin'
  } else if (token.includes('staff')) {
    userRole = 'staff'
  }

  // Return the appropriate mock user based on the role
  return mockUsers[userRole]
}
