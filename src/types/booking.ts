import { CustomerPartial } from '@/types/customer'
import { ServicePartial } from '@/types/service'
import { StaffMemberPartial } from '@/types/staff'

export interface Booking {
  id: string
  customer: CustomerPartial
  service: ServicePartial
  staff: StaffMemberPartial
  startTime: string
  endTime: string
  status: BookingStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum BookingStatus {
  PENDING = 'pending', // Awaiting confirmation
  CONFIRMED = 'confirmed', // Booking is confirmed
  COMPLETED = 'completed', // Service has been provided
  CANCELLED = 'cancelled', // Booking was cancelled
  NO_SHOW = 'no-show', // Customer didn't show up
}

export interface BookingFormData {
  customerId: string
  serviceId: string
  staffId: string
  startTime: string
  endTime: string
  notes?: string
}

export interface BookingFilters {
  startDate?: string
  endDate?: string
  staffId?: string
  customerId?: string
  status?: BookingStatus
}

// For the calendar display
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps: {
    booking: Booking
  }
}
