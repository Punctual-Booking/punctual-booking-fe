import { create } from 'zustand'
import { useLogin } from '@/hooks/auth/useLogin'
import { useRegister } from '@/hooks/auth/useRegister'
import { useLogout } from '@/hooks/auth/useLogout'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'

interface AuthState {
  isLoading: boolean
  error: string | null
  clearError: () => void
}

/**
 * Auth store for managing global authentication state
 * This is kept minimal since most data is managed by React Query
 */
const useAuthStore = create<AuthState>(set => ({
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
}))

/**
 * Main authentication hook that combines all auth-related functionality
 * Provides a unified API for login, registration, logout, and auth state
 */
export const useAuth = () => {
  const store = useAuthStore()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const { user, isAuthenticated } = useCurrentUser()

  return {
    // Auth state
    isAuthenticated,
    user,
    isLoading:
      store.isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    error:
      store.error ||
      loginMutation.error?.message ||
      registerMutation.error?.message ||
      logoutMutation.error?.message,
    clearError: store.clearError,

    // Login
    login: async (email: string, password: string) => {
      try {
        useAuthStore.setState({ isLoading: true, error: null })
        await loginMutation.mutateAsync({ email, password })
        return true
      } catch (error) {
        if (error instanceof Error) {
          useAuthStore.setState({ error: error.message })
        } else {
          useAuthStore.setState({ error: 'Login failed' })
        }
        return false
      } finally {
        useAuthStore.setState({ isLoading: false })
      }
    },
    isLoginLoading: loginMutation.isPending,

    // Register
    register: async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ) => {
      try {
        useAuthStore.setState({ isLoading: true, error: null })
        await registerMutation.mutateAsync({
          firstName,
          lastName,
          email,
          password,
          passwordConfirmation,
        })
        return true
      } catch (error) {
        if (error instanceof Error) {
          useAuthStore.setState({ error: error.message })
        } else {
          useAuthStore.setState({ error: 'Registration failed' })
        }
        return false
      } finally {
        useAuthStore.setState({ isLoading: false })
      }
    },
    isRegisterLoading: registerMutation.isPending,

    // Logout
    logout: async () => {
      try {
        useAuthStore.setState({ isLoading: true, error: null })

        // Clear any stored component state
        localStorage.removeItem('appointmentData')

        // Execute the logout mutation
        await logoutMutation.mutateAsync()

        // Reload the page after logout to ensure all state is cleared
        // This is a simple but effective way to ensure no stale data remains
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }

        return true
      } catch (error) {
        if (error instanceof Error) {
          useAuthStore.setState({ error: error.message })
        } else {
          useAuthStore.setState({ error: 'Logout failed' })
        }
        return false
      } finally {
        useAuthStore.setState({ isLoading: false })
      }
    },
    isLogoutLoading: logoutMutation.isPending,
  }
}
