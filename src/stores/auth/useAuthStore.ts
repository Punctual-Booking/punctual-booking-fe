import { create } from 'zustand'
import { User } from '@/types/auth'
import { logout } from '@/services/auth/logout'
import { useLogin, useRegister, useCurrentUser } from '@/hooks/auth'
import { queryClient } from '@/lib/queryClient'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: User | null
  logout: () => Promise<void>
  clearError: () => void
}

// We'll keep a zustand store for the authentication state,
// but the actual data fetching will be handled by React Query
export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await logout()
      // Clear user data from React Query cache
      queryClient.setQueryData(['user'], null)
      set({ isAuthenticated: false, user: null })
    } catch (error) {
      set({ error: 'Logout failed' })
    } finally {
      set({ isLoading: false })
    }
  },
  clearError: () => set({ error: null }),
}))

// This hook combines Zustand and React Query
export const useAuth = () => {
  const store = useAuthStore()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const currentUser = useCurrentUser()

  console.log('currentUser', currentUser)

  // Set the authenticated state based on the presence of a user
  if (currentUser && !store.isAuthenticated) {
    useAuthStore.setState({
      isAuthenticated: true,
      user: currentUser.user as User,
    })
  }

  return {
    // From store
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    error:
      store.error ||
      loginMutation.error?.message ||
      registerMutation.error?.message,
    clearError: store.clearError,
    logout: store.logout,

    // Login mutation
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

    // Register mutation
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
  }
}
