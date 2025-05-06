import { Service } from '@/types/service'
import { mockServiceData, mockStaffData } from './mockData'

/**
 * Mock function to get all services
 */
export const mockGetServices = async (): Promise<Service[]> => {
  console.log('Mock: Getting all services')
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockServiceData
}

/**
 * Mock function to get a service by ID
 */
export const mockGetServiceById = async (id: string): Promise<Service> => {
  console.log(`Mock: Getting service with ID ${id}`)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const service = mockServiceData.find(s => s.id === id)
  if (!service) {
    throw new Error(`Service with ID ${id} not found`)
  }

  return service
}

/**
 * Mock function to get services by staff ID
 */
export const mockGetServicesByStaffId = async (
  staffId: string
): Promise<Service[]> => {
  console.log(`Mock: Getting services for staff ${staffId}`)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Find the staff member and get their services
  const staffMember = mockStaffData.find(s => s.id === staffId)
  if (!staffMember) {
    throw new Error(`Staff with ID ${staffId} not found`)
  }

  // Filter services that this staff member can provide
  const staffServices = mockServiceData.filter(service =>
    staffMember.services.includes(service.id)
  )

  console.log(
    `Mock: Found ${staffServices.length} services for staff ${staffId}`
  )
  return staffServices
}
