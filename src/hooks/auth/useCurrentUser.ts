import { User } from '@/types/auth'
import { queryClient } from '@/lib/queryClient'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser as fetchCurrentUser } from '@/services/auth/me'

/**
 * Hook to get the current user data from the cache and ensure it stays in sync.
 *
 * This hook leverages the auth state that was initialized by the AuthProvider,
 * which means that in most cases it won't need to make a network request.
 */
export const useCurrentUser = () => {
  // Use the query that will either return cached data or refetch if stale
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,

    // Only fetch if there is a token but the cache is empty
    // Adding this condition prevents unnecessary fetches when user data is already in cache
    enabled:
      !!localStorage.getItem('access_token') &&
      !queryClient.getQueryData(['user']),

    // Don't refetch on window focus to avoid disrupting user experience
    refetchOnWindowFocus: false,

    // Increase staleTime to prevent frequent refetches
    staleTime: 60 * 60 * 1000, // 1 hour

    // Add retry settings to prevent multiple retries on failure
    retry: false,
  })

  const isAuthenticated = !!userData

  return {
    user: userData,
    isAuthenticated,
  }
}
