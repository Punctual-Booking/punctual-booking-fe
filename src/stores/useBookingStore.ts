import { create } from 'zustand'
import { Booking, BookingFormData, BookingStatus } from '@/types/booking'
import { Service } from '@/types/service'
import { StaffMember } from '@/types/staff'
import { CustomerStatus } from '@/types/customer'
interface BookingStore {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  fetchBookings: () => Promise<void>
  createBooking: (data: BookingFormData) => Promise<void>
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>
  selectedService: Service | null
  selectedStaff: StaffMember | null
  setSelectedService: (service: Service) => void
  setSelectedStaff: (staff: StaffMember) => void
  userBookings: Booking[]
  fetchUserBookings: (userId: string) => Promise<void>
}

// Dummy data
const dummyBookings: Booking[] = [
  {
    id: '1',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      createdAt: '2024-03-19T15:00:00',
      status: CustomerStatus.ACTIVE,
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
      phone: '1234567890',
      specialties: ['Haircut', 'Beard Trim', "Men's Styling"],
      yearsOfExperience: 5,
      isActive: true,
    },

    startTime: '2025-02-27T10:00:00',
    endTime: '2025-02-27T10:30:00',
    status: BookingStatus.CONFIRMED,
    notes: 'First time customer',
    createdAt: '2025-02-27T10:00:00',
    updatedAt: '2025-02-27T10:00:00',
  },
  {
    id: '2',
    customer: {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '1234567890',
      createdAt: '2025-02-27T10:00:00',
      status: CustomerStatus.ACTIVE,
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
      phone: '1234567890',
      specialties: ['Haircut', 'Beard Trim', "Men's Styling"],
      yearsOfExperience: 5,
      isActive: true,
    },
    startTime: '2025-02-27T14:00:00',
    endTime: '2025-02-27T16:00:00',
    status: BookingStatus.PENDING,
    createdAt: '2025-02-27T16:00:00',
    updatedAt: '2025-02-27T16:00:00',
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
        status: BookingStatus.PENDING,
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
  selectedService: null,
  selectedStaff: null,
  setSelectedService: service => set({ selectedService: service }),
  setSelectedStaff: staff => set({ selectedStaff: staff }),
  userBookings: [],
  fetchUserBookings: async userId => {
    set({ isLoading: true })
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For now, let's use mock data
      const mockBookings = [
        {
          id: '1',
          customer: {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            createdAt: new Date().toISOString(),
            status: CustomerStatus.ACTIVE,
          },
          service: { id: '1', name: 'Haircut', duration: 30, price: 25 },
          staff: { id: '1', name: 'Jane Smith', role: 'stylist' },
          startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          endTime: new Date(Date.now() + 86400000 + 1800000).toISOString(), // tomorrow + 30min
          status: BookingStatus.CONFIRMED,
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          customer: {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            createdAt: new Date().toISOString(),
            status: CustomerStatus.ACTIVE,
          },
          service: { id: '2', name: 'Hair Color', duration: 90, price: 75 },
          staff: { id: '2', name: 'Mike Johnson', role: 'colorist' },
          startTime: new Date(Date.now() + 7 * 86400000).toISOString(), // next week
          endTime: new Date(Date.now() + 7 * 86400000 + 5400000).toISOString(), // next week + 90min
          status: BookingStatus.CONFIRMED,
          notes: 'Light brown color',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          customer: {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            createdAt: new Date().toISOString(),
            status: CustomerStatus.ACTIVE,
          },
          service: { id: '1', name: 'Haircut', duration: 30, price: 25 },
          staff: { id: '1', name: 'Jane Smith', role: 'stylist' },
          startTime: new Date(Date.now() - 14 * 86400000).toISOString(), // 2 weeks ago
          endTime: new Date(Date.now() - 14 * 86400000 + 1800000).toISOString(), // 2 weeks ago + 30min
          status: BookingStatus.COMPLETED,
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      // Update customer object the same way for the other mock bookings
      const updatedMockBookings = mockBookings.map(booking => ({
        ...booking,
        customer: {
          ...booking.customer,
          createdAt: new Date().toISOString(),
          status: CustomerStatus.ACTIVE,
        },
      }))

      set({ userBookings: updatedMockBookings, isLoading: false })
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      set({ isLoading: false, error: 'Failed to fetch bookings' })
    }
  },
}))
