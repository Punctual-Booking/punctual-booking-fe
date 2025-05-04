import { API_URL, BUSINESS_ID, FEATURES } from '@/config'
import { StaffMember } from '@/types/staff'
import {
  mockGetStaff,
  mockGetStaffById,
  mockGetStaffByServiceId,
} from '@/mocks/mockStaffService'

/**
 * Fetches all staff members from the API
 */
export const getStaff = async (): Promise<StaffMember[]> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_STAFF) {
    console.log('Using mock staff service for getStaff')
    return mockGetStaff()
  }

  const response = await fetch(
    `${API_URL}/api/staff?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch staff')
  }

  return response.json()
}

/**
 * Fetches a single staff member by ID
 */
export const getStaffById = async (id: string): Promise<StaffMember> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_STAFF) {
    console.log('Using mock staff service for getStaffById')
    return mockGetStaffById(id)
  }

  const response = await fetch(
    `${API_URL}/api/staff/${id}?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch staff member')
  }

  return response.json()
}

/**
 * Fetches staff members that can perform a specific service
 */
export const getStaffByServiceId = async (
  serviceId: string
): Promise<StaffMember[]> => {
  // Use mock implementation if feature flag is enabled
  if (FEATURES.MOCK_STAFF) {
    console.log('Using mock staff service for getStaffByServiceId')
    return mockGetStaffByServiceId(serviceId)
  }

  const response = await fetch(
    `${API_URL}/api/staff/service/${serviceId}?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch staff for service')
  }

  return response.json()
}
