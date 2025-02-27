import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth/useAuthStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    switch (user?.role) {
      case 'admin':
      case 'staff':
        return <Navigate to="/admin" replace />
      case 'user':
        return <Navigate to="/booking" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
