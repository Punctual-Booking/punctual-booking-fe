import { User, UserRole } from '@/types/auth'

/**
 * Mock user data for testing purposes
 * This simulates what would be returned from the /me endpoint
 */
export const mockAdminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
}

export const mockStaffUser: User = {
  id: '2',
  name: 'Staff Member',
  email: 'staff@example.com',
  role: UserRole.STAFF,
}

export const mockCustomerUser: User = {
  id: '3',
  name: 'Customer',
  email: 'customer@example.com',
  role: UserRole.USER,
}
