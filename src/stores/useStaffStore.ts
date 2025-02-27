import { create } from 'zustand'
import { StaffMember } from '@/types/staff'

interface StaffStore {
  staff: StaffMember[]
  isLoading: boolean
  error: string | null
  fetchStaff: () => Promise<void>
}

// Temporary dummy data
const dummyStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '123-456-789',
    image: '/images/staff/maria.jpg',
    specialties: ['Hair Coloring', 'Hair Treatment', 'Styling'],
    yearsOfExperience: 8,
    isActive: true,
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
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@example.com',
    phone: '456-789-123',
    image: '/images/staff/ana.jpg',
    specialties: ['Hair Coloring', 'Haircut', 'Wedding Styling'],
    yearsOfExperience: 10,
    isActive: true,
  },
]

export const useStaffStore = create<StaffStore>(set => ({
  staff: [],
  isLoading: false,
  error: null,
  fetchStaff: async () => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ staff: dummyStaff, error: null })
    } catch (error) {
      set({ error: 'Failed to fetch staff' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
