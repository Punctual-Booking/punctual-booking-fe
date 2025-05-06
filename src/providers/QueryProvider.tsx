import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { ReactNode } from 'react'

export interface QueryProviderProps {
  children: ReactNode
}

/**
 * QueryProvider is responsible for providing the React Query client
 * to the rest of the application.
 *
 * Authentication is now handled by the AuthProvider.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
