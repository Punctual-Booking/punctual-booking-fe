import { API_URL, BUSINESS_ID, FEATURES } from '@/config'
import { Service } from '@/types/service'
import {
  mockGetServices,
  mockGetServiceById,
  mockGetServicesByStaffId,
} from '@/mocks/mockServiceService'

/**
 * Fetches all services from the API
 */
export const getServices = async (): Promise<Service[]> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_SERVICES) {
    console.log('Using mock service service for getServices')
    return mockGetServices()
  }

  const response = await fetch(
    `${API_URL}/api/services?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch services')
  }

  return response.json()
}

/**
 * Fetches a single service by ID
 */
export const getServiceById = async (id: string): Promise<Service> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_SERVICES) {
    console.log('Using mock service service for getServiceById')
    return mockGetServiceById(id)
  }

  const response = await fetch(
    `${API_URL}/api/services/${id}?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch service')
  }

  return response.json()
}

/**
 * Fetches services that can be provided by a specific staff member
 */
export const getServicesByStaffId = async (
  staffId: string
): Promise<Service[]> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_SERVICES) {
    console.log('Using mock service service for getServicesByStaffId')
    return mockGetServicesByStaffId(staffId)
  }

  const response = await fetch(
    `${API_URL}/api/services/staff/${staffId}?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch services for staff')
  }

  return response.json()
}
