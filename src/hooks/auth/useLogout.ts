import { useMutation } from '@tanstack/react-query'
import { logout as logoutService } from '@/services/auth/logout'
import { queryClient } from '@/lib/queryClient'

/**
 * Hook for handling user logout
 * Uses TanStack Query for data mutation and clearing cached data
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      // Clear user data from the query cache
      queryClient.setQueryData(['user'], null)

      // Clear appointments data
      queryClient.setQueryData(['appointments'], [])
      queryClient.setQueryData(['appointment'], null)

      // Reset all query cache to ensure no stale data persists across sessions
      queryClient.clear()
    },
  })
}
