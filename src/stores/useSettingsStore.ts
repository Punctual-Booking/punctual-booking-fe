import { create } from 'zustand'

interface BusinessSettings {
  businessName: string
  description: string
  openingTime: string
  closingTime: string
  address: string
  phone: string
  email: string
  logoUrl?: string
}

interface BookingSettings {
  minNotice: number // in hours
  maxNotice: number // in days
  slotDuration: number // in minutes
  bufferTime: number // in minutes
  maxBookingsPerSlot: number
}

interface NotificationSettings {
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  reminderTime: number // in hours before appointment
  enableStaffNotifications: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  dateFormat: string
  timeFormat: string
  currency: string
}

interface SettingsState {
  business: BusinessSettings
  booking: BookingSettings
  notification: NotificationSettings
  appearance: AppearanceSettings
  isLoading: boolean
  error: string | null
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  siteLanguage: string

  // Actions
  fetchSettings: () => Promise<void>
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void
  updateBookingSettings: (settings: Partial<BookingSettings>) => void
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  updateAppearanceSettings: (settings: Partial<AppearanceSettings>) => void
  saveSettings: () => Promise<void>
  updateSettings: (settings: Partial<SettingsState>) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  business: {
    businessName: 'Beauty Salon',
    description: 'A luxury beauty salon offering a wide range of services',
    openingTime: '09:00',
    closingTime: '17:00',
    address: '123 Main Street, City',
    phone: '+1 (555) 123-4567',
    email: 'contact@beautysalon.com',
    logoUrl: '',
  },
  booking: {
    minNotice: 24,
    maxNotice: 30,
    slotDuration: 30,
    bufferTime: 15,
    maxBookingsPerSlot: 1,
  },
  notification: {
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    reminderTime: 24,
    enableStaffNotifications: true,
  },
  appearance: {
    theme: 'system',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'USD',
  },
  isLoading: false,
  error: null,
  businessName: 'BeautySalon',
  businessEmail: 'contact@beautysalon.com',
  businessPhone: '+1 (555) 123-4567',
  businessAddress: '123 Salon Street, Beauty City',
  siteLanguage: 'en',

  fetchSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // For now, we're using default values
      set({ isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch settings', isLoading: false })
    }
  },

  updateBusinessSettings: settings => {
    set(state => ({
      business: {
        ...state.business,
        ...settings,
      },
    }))
  },

  updateBookingSettings: settings => {
    set(state => ({
      booking: {
        ...state.booking,
        ...settings,
      },
    }))
  },

  updateNotificationSettings: settings => {
    set(state => ({
      notification: {
        ...state.notification,
        ...settings,
      },
    }))
  },

  updateAppearanceSettings: settings => {
    set(state => ({
      appearance: {
        ...state.appearance,
        ...settings,
      },
    }))
  },

  saveSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', {
        business: get().business,
        booking: get().booking,
        notification: get().notification,
        appearance: get().appearance,
      })
      set({ isLoading: false })
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to save settings',
      })
      return Promise.reject(error)
    }
  },

  updateSettings: settings => {
    set(state => ({ ...state, ...settings }))
  },
}))
