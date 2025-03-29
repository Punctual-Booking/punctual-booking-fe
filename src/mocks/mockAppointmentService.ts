import { AppointmentResponseDto, AppointmentStatus } from '@/types/appointment'
import { addDays, addHours, addMinutes, subDays } from 'date-fns'
import { BUSINESS_ID } from '@/config'

// Mock staff data
const mockStaff = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '123-456-789',
    image: '/images/staff/maria.jpg',
    specialties: ['Hair Coloring', 'Hair Treatment', 'Styling'],
    yearsOfExperience: 8,
    isActive: true,
    services: [],
    businessId: BUSINESS_ID,
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@example.com',
    phone: '987-654-321',
    image: '/images/staff/joao.jpg',
    specialties: ['Haircut', 'Beard Trim', "Men's Styling"],
    yearsOfExperience: 5,
    isActive: true,
    services: [],
    businessId: BUSINESS_ID,
  },
]

// Mock services data
const mockServices = [
  {
    id: '1',
    name: 'Haircut',
    description: 'Classic haircut with wash and style',
    price: 30,
    duration: 30,
    image: '/images/services/haircut.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '2',
    name: 'Hair Coloring',
    description: 'Full color treatment with professional products',
    price: 100,
    duration: 120,
    image: '/images/services/coloring.jpg',
    businessId: BUSINESS_ID,
  },
]

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
