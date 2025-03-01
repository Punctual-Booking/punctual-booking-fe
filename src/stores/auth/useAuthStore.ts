import { create } from 'zustand'
import { User, UserRole } from '@/types/auth'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false, // TODO: Remove this
  isLoading: false,
  error: null,
  user: {
    // TODO: Remove this
    id: '1',
    name: 'Customer User',
    email: 'customer@example.com',
    role: UserRole.ADMIN,
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null })

    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        name: 'Customer User',
        email,
        password,
        role: UserRole.ADMIN,
      }
      set({ isAuthenticated: true, user: mockUser })
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
      console.log('name', name)
      console.log('email', email)
      console.log('password', password)
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
      console.log('logout')
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ isAuthenticated: false })
    } catch (error) {
      set({ error: 'Logout failed' })
    } finally {
      set({ isLoading: false })
    }
  },
  clearError: () => set({ error: null }),
}))
