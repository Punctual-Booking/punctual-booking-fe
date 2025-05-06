import { QueryClient } from '@tanstack/react-query'

/**
 * Centralized QueryClient with optimized defaults to reduce unnecessary
 * rerenders and network requests.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry failed queries automatically to avoid extra render cycles
      retry: 1,

      // Don't refetch on window focus to avoid unexpected data refreshes
      refetchOnWindowFocus: false,

      // Longer stale time means data remains "fresh" longer, reducing refetches
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Reduce unnecessary rerenders caused by background refetching
      refetchOnMount: 'always',

      // Don't refetch when components reconnect to avoid redundant requests
      refetchOnReconnect: false,

      // Structure preserving helps prevent rerenders when data shape hasn't changed
      structuralSharing: true,
    },
  },
})
