import { API_URL, BUSINESS_ID, FEATURES } from '@/config'
import {
  AppointmentResponseDto,
  AppointmentUpdateDto,
} from '@/types/appointment'
import {
  mockGetUserAppointments,
  mockUpdateAppointment,
  mockCreateAppointment,
  mockGetAppointmentById,
} from '@/mocks/mockAppointmentService'

// Use mock implementation based on feature flag
const USE_MOCK = FEATURES.MOCK_APPOINTMENTS

/**
 * Fetches appointments for a specific user
 */
export const getUserAppointments = async (
  customerId: string
): Promise<AppointmentResponseDto[]> => {
  console.log(
    `appointmentService.getUserAppointments - customerId: ${customerId}, MOCK: ${USE_MOCK}`
  )

  if (USE_MOCK) {
    console.log('Using mock appointment service')
    const result = await mockGetUserAppointments(customerId)
    console.log(`Got ${result.length} mock appointments`)
    return result
  }

  console.log(
    `Making real API call to fetch appointments for user: ${customerId}`
  )
  const response = await fetch(
    `${API_URL}/api/appointments?customerId=${customerId}&businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || `Failed to fetch appointments: ${response.status}`
    console.error('API error:', errorMessage)
    throw new Error(errorMessage)
  }

  const data = await response.json()
  console.log(`Got ${data.length} real appointments from API`)
  return data
}

/**
 * Updates an appointment status
 */
export const updateAppointment = async (
  id: string,
  updateData: AppointmentUpdateDto
): Promise<AppointmentResponseDto> => {
  console.log(
    `appointmentService.updateAppointment - id: ${id}, data:`,
    updateData,
    `MOCK: ${USE_MOCK}`
  )

  if (USE_MOCK) {
    console.log('Using mock appointment service')
    // If we only have status in the update data, use the simpler function
    if (
      Object.keys(updateData).length === 1 &&
      'status' in updateData &&
      updateData.status
    ) {
      return mockUpdateAppointment(id, updateData.status)
    }
    // In the future, we can extend mockUpdateAppointment to handle other fields
    throw new Error('Full appointment updates not supported in mock mode yet')
  }

  console.log(`Making real API call to update appointment: ${id}`)
  const response = await fetch(
    `${API_URL}/api/appointments/${id}?businessId=${BUSINESS_ID}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateData),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || `Failed to update appointment: ${response.status}`
    console.error('API error:', errorMessage)
    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Creates a new appointment
 */
export const createAppointment = async (data: {
  staffId: string
  serviceId: string
  appointmentTime: string
  customerNotes?: string
  businessId: string
}): Promise<AppointmentResponseDto> => {
  console.log(
    `appointmentService.createAppointment - data:`,
    data,
    `MOCK: ${USE_MOCK}`
  )

  if (USE_MOCK) {
    console.log('Using mock appointment service')
    const result = await mockCreateAppointment(data)
    console.log('Mock appointment created:', result)
    return result
  }

  console.log(`Making real API call to create appointment`)
  const response = await fetch(`${API_URL}/api/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || `Failed to create appointment: ${response.status}`
    console.error('API error:', errorMessage)
    throw new Error(errorMessage)
  }

  const result = await response.json()
  console.log('Appointment created successfully:', result)
  return result
}

/**
 * Fetches a single appointment by ID
 */
export const getAppointmentById = async (
  id: string
): Promise<AppointmentResponseDto> => {
  console.log(
    `appointmentService.getAppointmentById - id: ${id}, MOCK: ${USE_MOCK}`
  )

  if (USE_MOCK) {
    console.log('Using mock appointment service for getAppointmentById')
    return mockGetAppointmentById(id)
  }

  console.log(`Making real API call to fetch appointment: ${id}`)
  const token = localStorage.getItem('access_token') || undefined
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(
    `${API_URL}/api/appointments/${id}?businessId=${BUSINESS_ID}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage =
      errorData?.message || `Failed to fetch appointment: ${response.status}`
    console.error('API error:', errorMessage)
    throw new Error(errorMessage)
  }

  return response.json()
}
