import { useMutation } from '@tanstack/react-query'
import { login as loginService } from '@/services/auth/login'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import { UserRole } from '@/types/auth'

interface LoginCredentials {
  email: string
  password: string
}

/**
 * Hook for handling user login
 * Uses TanStack Query for data mutation and caching
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      loginService(email, password),
    onSuccess: user => {
      // Update the cache with the user data
      queryClient.setQueryData(['user'], user)

      // Force a router navigation based on user role
      setTimeout(() => {
        if (user?.role === UserRole.CUSTOMER) {
          router.navigate({ to: '/user/dashboard' })
        } else if (
          user?.role === UserRole.ADMIN ||
          user?.role === UserRole.STAFF
        ) {
          router.navigate({ to: '/admin/dashboard' })
        }
      }, 100) // Short timeout to ensure the query cache is updated
    },
  })
}
