import { API_URL, BUSINESS_ID } from '@/config'
import { Service } from '@/types/service'

/**
 * Fetches all services from the API
 */
export const getServices = async (): Promise<Service[]> => {
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
