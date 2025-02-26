import { Customer } from '@/types/customer'
import { Service } from '@/types/service'
import { StaffMember } from '@/types/staff'

export interface Booking {
  id: string
  customer: Customer
  service: Service
  staff: StaffMember
  startTime: string
  endTime: string
  status: BookingStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type BookingStatus =
  | 'pending' // Awaiting confirmation
  | 'confirmed' // Booking is confirmed
  | 'completed' // Service has been provided
  | 'cancelled' // Booking was cancelled
  | 'no-show' // Customer didn't show up

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
