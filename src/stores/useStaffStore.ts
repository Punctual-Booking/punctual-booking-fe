import { create } from 'zustand'
import { StaffMember } from '@/types/staff'
import { getStaff, getStaffByServiceId } from '@/services/staffApi'

interface StaffStore {
  staff: StaffMember[]
  isLoading: boolean
  error: string | null
  fetchStaff: () => Promise<void>
  fetchStaffByService: (serviceId: string) => Promise<void>
}

export const useStaffStore = create<StaffStore>(set => ({
  staff: [],
  isLoading: false,
  error: null,
  fetchStaff: async () => {
    set({ isLoading: true })
    try {
      const staff = await getStaff()
      set({ staff, error: null })
    } catch (error) {
      console.error('Failed to fetch staff:', error)
      set({ error: 'Failed to fetch staff' })
    } finally {
      set({ isLoading: false })
    }
  },
  fetchStaffByService: async (serviceId: string) => {
    set({ isLoading: true })
    try {
      const staff = await getStaffByServiceId(serviceId)
      set({ staff, error: null })
    } catch (error) {
      console.error('Failed to fetch staff for service:', error)
      set({ error: 'Failed to fetch staff for service' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
