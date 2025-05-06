import { create } from 'zustand'
import { Service } from '@/types/service'
import { getServices, getServicesByStaffId } from '@/services/serviceApi'

interface ServiceStore {
  services: Service[]
  isLoading: boolean
  error: string | null
  fetchServices: () => Promise<void>
  fetchServicesByStaff: (staffId: string) => Promise<void>
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
  fetchServicesByStaff: async (staffId: string) => {
    set({ isLoading: true })
    try {
      // Use the API function that gets services filtered by staff ID
      const services = await getServicesByStaffId(staffId)
      set({ services, error: null })
    } catch (error) {
      console.error('Failed to fetch services by staff:', error)
      set({ error: 'Failed to fetch services for this staff member' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
