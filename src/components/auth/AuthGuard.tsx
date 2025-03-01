import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { UserRole } from '@/types/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuthStore()

  // Only redirect if authenticated
  if (!isAuthenticated) {
    return <>{children}</>
  }

  // Handle redirection based on role
  let redirectPath = '/'

  switch (user?.role) {
    case UserRole.ADMIN:
    case UserRole.STAFF:
      redirectPath = '/admin'
      break
    case UserRole.USER:
      redirectPath = '/user/dashboard'
      break
  }

  return <Navigate to={redirectPath} replace />
}
