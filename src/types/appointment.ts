import { Service } from './service'
import { StaffMember } from './staff'

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  RESCHEDULED = 'rescheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'noShow',
}

export interface AppointmentResponseDto {
  id: string
  staffId: string
  staff: StaffMember
  serviceId: string
  service: Service
  customerId: string
  customerName: string
  appointmentTime: string
  endTime: string
  status: AppointmentStatus
  customerNotes?: string
  createdAt: string
  updatedAt: string
  businessId: string
}

export interface AppointmentCreateDto {
  staffId: string
  serviceId: string
  appointmentTime: string
  customerNotes?: string
  businessId: string
}

export interface AppointmentUpdateDto {
  appointmentTime?: string
  status?: AppointmentStatus
  customerNotes?: string
  businessId?: string
}

// For the client-side model that includes nested objects
export interface Appointment {
  id: string
  customer: {
    id: string
    name: string
  }
  staff: {
    id: string
    name: string
  }
  service: {
    id: string
    name: string
    price: number
    duration: number
  }
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
  updatedAt: string
  businessId: string
}

// Mapper function to convert API response to client model
export const mapAppointmentFromDto = (
  dto: AppointmentResponseDto
): Appointment => {
  // Calculate end time based on duration
  const startTime = new Date(dto.appointmentTime)
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + dto.service.duration)

  return {
    id: dto.id,
    customer: {
      id: dto.customerId,
      name: dto.customerName,
    },
    staff: {
      id: dto.staffId,
      name: dto.staff.name,
    },
    service: {
      id: dto.serviceId,
      name: dto.service.name,
      price: dto.service.price,
      duration: dto.service.duration,
    },
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: dto.status,
    notes: dto.customerNotes,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    businessId: dto.businessId,
  }
}
