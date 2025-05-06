import { AppointmentResponseDto, AppointmentStatus } from '@/types/appointment'
import { addDays, addMinutes, subDays } from 'date-fns'
import { BUSINESS_ID } from '@/config'
import { mockStaffData, mockServiceData } from './mockData'

// Mock staff data from centralized store
const mockStaff = mockStaffData

// Mock services data from centralized store
const mockServices = mockServiceData

/**
 * Generates a random appointment
 */
const generateRandomAppointment = (
  customerId: string,
  status: AppointmentStatus,
  dateOffset: number = 0,
  overrides: Partial<AppointmentResponseDto> = {}
): AppointmentResponseDto => {
  const baseDate = new Date()
  const appointmentTime = addDays(baseDate, dateOffset)

  // Calculate a random hour between 9 AM and 6 PM
  appointmentTime.setHours(9 + Math.floor(Math.random() * 9), 0, 0, 0)

  // Select a random service and staff
  const service = mockServices[Math.floor(Math.random() * mockServices.length)]
  const staff = mockStaff[Math.floor(Math.random() * mockStaff.length)]
  const endTime = addMinutes(appointmentTime, service.duration)

  const appointment: AppointmentResponseDto = {
    id: `app-${Math.random().toString(36).substring(2, 11)}`,
    staffId: staff.id,
    staff: staff,
    serviceId: service.id,
    service: service,
    customerId,
    customerName: 'John Doe',
    appointmentTime: appointmentTime.toISOString(),
    endTime: endTime.toISOString(),
    status,
    customerNotes: 'Test appointment',
    createdAt: subDays(appointmentTime, 5).toISOString(),
    updatedAt: subDays(appointmentTime, 5).toISOString(),
    businessId: BUSINESS_ID,
    ...overrides,
  }

  return appointment
}

/**
 * Generates mock appointments for a user
 */
const generateMockAppointments = (
  customerId: string
): AppointmentResponseDto[] => {
  const appointments: AppointmentResponseDto[] = [
    // Upcoming appointments
    generateRandomAppointment(customerId, AppointmentStatus.SCHEDULED, 3),
    generateRandomAppointment(customerId, AppointmentStatus.SCHEDULED, 10),

    // Rescheduled appointment
    generateRandomAppointment(customerId, AppointmentStatus.RESCHEDULED, 5),

    // Past appointments
    generateRandomAppointment(customerId, AppointmentStatus.COMPLETED, -7),
    generateRandomAppointment(customerId, AppointmentStatus.COMPLETED, -14),
    generateRandomAppointment(customerId, AppointmentStatus.CANCELLED, -21),
  ]

  return appointments
}

// Store mock data to simulate persistence
const mockAppointments: Record<string, AppointmentResponseDto[]> = {}

// Add listener to clear mock data on logout
if (typeof window !== 'undefined') {
  window.addEventListener('mock-logout', () => {
    console.log('Mock: Clearing appointment data on logout')
    // Clear all mock appointments data
    Object.keys(mockAppointments).forEach(key => {
      delete mockAppointments[key]
    })
  })
}

/**
 * Mock implementation for getting an appointment by ID
 */
export const mockGetAppointmentById = async (
  id: string
): Promise<AppointmentResponseDto> => {
  console.log('Mock: Getting appointment by ID', id)

  // Delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800))

  // Find the appointment in all user appointments
  let foundAppointment: AppointmentResponseDto | undefined

  Object.keys(mockAppointments).forEach(userId => {
    const appointment = mockAppointments[userId].find(app => app.id === id)
    if (appointment) {
      foundAppointment = appointment
    }
  })

  // If we couldn't find the appointment, generate a new one for demo purposes
  if (!foundAppointment) {
    console.log(
      `Appointment with ID ${id} not found, generating a sample appointment for demo`
    )

    // Generate a random appointment for testing purposes
    // In a real app, we would return a 404 error
    const customerId = 'mock-user-id'
    foundAppointment = generateRandomAppointment(
      customerId,
      AppointmentStatus.SCHEDULED,
      3,
      { id }
    )

    // Store this appointment for future reference
    if (!mockAppointments[customerId]) {
      mockAppointments[customerId] = []
    }
    mockAppointments[customerId].push(foundAppointment)
  }

  return foundAppointment
}

/**
 * Mock implementation for getting user appointments
 */
export const mockGetUserAppointments = async (
  customerId: string
): Promise<AppointmentResponseDto[]> => {
  console.log('Mock: Getting appointments for customer', customerId)

  // Delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Always generate mock appointments for any user ID
  if (!customerId) {
    console.warn('No customer ID provided to mockGetUserAppointments')
    return []
  }

  // Check if this is the mock user from our mock auth
  const isMockAuthUser = customerId === 'mock-user-id'

  // If we don't have appointments for this user, generate them
  if (!mockAppointments[customerId]) {
    console.log('Generating mock appointments for user', customerId)
    mockAppointments[customerId] = generateMockAppointments(customerId)
  } else if (isMockAuthUser && mockAppointments[customerId].length === 0) {
    // Ensure we always have some data for our mock user
    console.log('Ensuring mock user has appointments')
    mockAppointments[customerId] = generateMockAppointments(customerId)
  }

  return mockAppointments[customerId] || []
}

/**
 * Mock implementation for updating an appointment
 */
export const mockUpdateAppointment = async (
  id: string,
  status: AppointmentStatus
): Promise<AppointmentResponseDto> => {
  console.log('Mock: Updating appointment', id, 'with status', status)

  // Delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Find the appointment in all user appointments
  let updatedAppointment: AppointmentResponseDto | undefined

  // Update the appointment in our mock storage
  Object.keys(mockAppointments).forEach(userId => {
    mockAppointments[userId] = mockAppointments[userId].map(app => {
      if (app.id === id) {
        updatedAppointment = {
          ...app,
          status,
          updatedAt: new Date().toISOString(),
        }
        return updatedAppointment
      }
      return app
    })
  })

  if (!updatedAppointment) {
    throw new Error('Appointment not found')
  }

  return updatedAppointment
}

/**
 * Mock implementation for creating a new appointment
 */
export const mockCreateAppointment = async (data: {
  staffId: string
  serviceId: string
  appointmentTime: string
  customerNotes?: string
  businessId?: string
}): Promise<AppointmentResponseDto> => {
  console.log('Mock: Creating appointment', data)

  // Delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Get the user ID from localStorage token or use a mock ID
  const token = localStorage.getItem('access_token')
  const customerId = token ? 'mock-user-id' : 'mock-guest-user'

  console.log('Mock: Creating appointment for customer', customerId)

  // Find the staff and service
  const staff = mockStaff.find(s => s.id === data.staffId)
  const service = mockServices.find(s => s.id === data.serviceId)

  console.log('Searching for staffId:', data.staffId)
  console.log(
    'Available mock staff IDs:',
    mockStaff.map(s => s.id)
  )
  console.log('Searching for serviceId:', data.serviceId)
  console.log(
    'Available mock service IDs:',
    mockServices.map(s => s.id)
  )

  if (!staff || !service) {
    throw new Error('Staff or service not found')
  }

  const appointmentTime = new Date(data.appointmentTime)
  const endTime = addMinutes(appointmentTime, service.duration)

  const newAppointment: AppointmentResponseDto = {
    id: `app-${Math.random().toString(36).substring(2, 11)}`,
    staffId: staff.id,
    staff,
    serviceId: service.id,
    service,
    customerId,
    customerName: 'John Doe',
    appointmentTime: appointmentTime.toISOString(),
    endTime: endTime.toISOString(),
    status: AppointmentStatus.SCHEDULED,
    customerNotes: data.customerNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    businessId: data.businessId || BUSINESS_ID,
  }

  // Add to our mock storage
  if (!mockAppointments[customerId]) {
    mockAppointments[customerId] = []
  }
  mockAppointments[customerId].push(newAppointment)

  return newAppointment
}
