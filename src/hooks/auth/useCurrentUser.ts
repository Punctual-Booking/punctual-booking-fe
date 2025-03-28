import { User } from '@/types/auth'
import { queryClient } from '@/lib/queryClient'

/**
 * Hook to get the current user data from the cache
 * Can be extended to fetch user data from an API if not available
 */
export const useCurrentUser = () => {
  return {
    // Return cached user data
    user: queryClient.getQueryData<User>(['user']),

    // Check if user is authenticated
    isAuthenticated: !!queryClient.getQueryData<User>(['user']),
  }
}
