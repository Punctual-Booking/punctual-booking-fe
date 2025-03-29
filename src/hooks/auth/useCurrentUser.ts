import { User } from '@/types/auth'
import { queryClient } from '@/lib/queryClient'

/**
 * Hook to get the current user data from the cache
 * Can be extended to fetch user data from an API if not available
 */
export const useCurrentUser = () => {
  const userData = queryClient.getQueryData<User>(['user'])
  console.log('useCurrentUser - cached user data:', userData)

  const isAuthenticated = !!userData
  console.log('useCurrentUser - isAuthenticated:', isAuthenticated)

  return {
    // Return cached user data
    user: userData,

    // Check if user is authenticated
    isAuthenticated,
  }
}
