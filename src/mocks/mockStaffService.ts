import { StaffMember } from '@/types/staff'
import { mockStaffData } from './mockData'

/**
 * Mock function to get all staff members
 */
export const mockGetStaff = async (): Promise<StaffMember[]> => {
  console.log('Mock: Getting all staff')
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockStaffData
}

/**
 * Mock function to get a staff member by ID
 */
export const mockGetStaffById = async (id: string): Promise<StaffMember> => {
  console.log(`Mock: Getting staff with ID ${id}`)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const staff = mockStaffData.find(s => s.id === id)
  if (!staff) {
    throw new Error(`Staff with ID ${id} not found`)
  }

  return staff
}

/**
 * Mock function to get staff members who can provide a specific service
 */
export const mockGetStaffByServiceId = async (
  serviceId: string
): Promise<StaffMember[]> => {
  console.log(`Mock: Getting staff for service ${serviceId}`)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Filter staff who have this service ID in their services array
  const filteredStaff = mockStaffData.filter(staff =>
    staff.services.includes(serviceId)
  )

  console.log(
    `Mock: Found ${filteredStaff.length} staff for service ${serviceId}`
  )
  return filteredStaff
}
