import { create } from 'zustand'
import { Service } from '@/types/service'

interface ServiceStore {
  services: Service[]
  isLoading: boolean
  error: string | null
  fetchServices: () => Promise<void>
}

// Temporary dummy data
const dummyServices: Service[] = [
  {
    id: '1',
    name: 'Haircut',
    description: 'Classic haircut with wash and style',
    price: 30,
    image: '/images/services/haircut.jpg',
  },
  {
    id: '2',
    name: 'Hair Coloring',
    description: 'Full color treatment with professional products',
    price: 100,
    image: '/images/services/coloring.jpg',
  },
  {
    id: '3',
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    price: 20,
    image: '/images/services/beard.jpg',
  },
]

export const useServiceStore = create<ServiceStore>(set => ({
  services: [],
  isLoading: false,
  error: null,
  fetchServices: async () => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ services: dummyServices, error: null })
    } catch (error) {
      set({ error: 'Failed to fetch services' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
