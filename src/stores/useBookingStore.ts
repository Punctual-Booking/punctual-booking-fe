import { create } from 'zustand'
import { Booking, BookingFormData } from '@/types/booking'

interface BookingStore {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  fetchBookings: () => Promise<void>
  createBooking: (data: BookingFormData) => Promise<void>
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>
}

// Dummy data
const dummyBookings: Booking[] = [
  {
    id: '1',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-03-19T15:00:00',
      status: 'active',
    },

    service: {
      id: '1',
      name: 'Haircut',
      description: 'Basic haircut',
      price: 25,
    },
    staff: {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@salon.com',
      role: 'staff',
    },

    startTime: '2024-03-20T10:00:00',
    endTime: '2024-03-20T10:30:00',
    status: 'confirmed',
    notes: 'First time customer',
    createdAt: '2024-03-19T15:00:00',
    updatedAt: '2024-03-19T15:00:00',
  },
  {
    id: '2',
    customer: {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      createdAt: '2024-03-19T15:00:00',
      status: 'active',
    },
    service: {
      id: '2',
      name: 'Hair Coloring',
      description: 'Full color treatment',
      price: 80,
    },
    staff: {
      id: '2',
      name: 'Bob Wilson',
      email: 'bob@salon.com',
      role: 'staff',
    },
    startTime: '2024-03-20T14:00:00',
    endTime: '2024-03-20T16:00:00',
    status: 'pending',
    createdAt: '2024-03-19T16:00:00',
    updatedAt: '2024-03-19T16:00:00',
  },
]

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  fetchBookings: async () => {
    if (get().bookings.length > 0) return // Prevent refetching if we already have data
    set({ isLoading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ bookings: dummyBookings, error: null })
    } catch (error) {
      set({ error: 'Failed to fetch bookings' })
    } finally {
      set({ isLoading: false })
    }
  },
  createBooking: async data => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newBooking: Booking = {
        id: Math.random().toString(),
        customer: dummyBookings[0].customer, // Temporary: Use first dummy customer
        service: dummyBookings[0].service, // Temporary: Use first dummy service
        staff: dummyBookings[0].staff, // Temporary: Use first dummy staff
        status: 'pending',
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set(state => ({ bookings: [...state.bookings, newBooking] }))
    } catch (error) {
      set({ error: 'Failed to create booking' })
    } finally {
      set({ isLoading: false })
    }
  },
  updateBooking: async (id, booking) => {
    set({ isLoading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === id
            ? { ...b, ...booking, updatedAt: new Date().toISOString() }
            : b
        ),
      }))
    } catch (error) {
      set({ error: 'Failed to update booking' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
