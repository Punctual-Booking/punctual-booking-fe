import { create } from 'zustand'
import { Service } from '@/types/service'
import { getServices } from '@/services/serviceApi'

interface ServiceStore {
  services: Service[]
  isLoading: boolean
  error: string | null
  fetchServices: () => Promise<void>
}

export const useServiceStore = create<ServiceStore>(set => ({
  services: [],
  isLoading: false,
  error: null,
  fetchServices: async () => {
    set({ isLoading: true })
    try {
      const services = await getServices()
      set({ services, error: null })
    } catch (error) {
      console.error('Failed to fetch services:', error)
      set({ error: 'Failed to fetch services' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
