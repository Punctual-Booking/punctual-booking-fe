import { useMutation } from '@tanstack/react-query'
import { login as loginService } from '@/services/auth/login'
import { queryClient } from '@/lib/queryClient'

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
      // Invalidate and refetch any queries that use user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.setQueryData(['user'], user)
    },
  })
}
