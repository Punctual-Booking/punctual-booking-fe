import { API_URL, BUSINESS_ID } from '@/config'
import { StaffMember } from '@/types/staff'

/**
 * Fetches all staff members from the API
 */
export const getStaff = async (): Promise<StaffMember[]> => {
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
