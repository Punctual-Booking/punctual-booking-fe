import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Implement actual login logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ isAuthenticated: true })
    } catch (error) {
      set({ error: 'Login failed' })
    } finally {
      set({ isLoading: false })
    }
  },
  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Implement actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ isAuthenticated: true })
    } catch (error) {
      set({ error: 'Registration failed' })
    } finally {
      set({ isLoading: false })
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Implement actual logout logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ isAuthenticated: false })
    } catch (error) {
      set({ error: 'Logout failed' })
    } finally {
      set({ isLoading: false })
    }
  },
  clearError: () => set({ error: null })
})) 