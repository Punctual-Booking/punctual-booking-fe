import { useEffect, useState } from 'react'
import { UserRole } from '@/types/auth'

export const useAuth = () => {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call to get user role
    const fetchUserRole = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRole('admin') // For testing
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  return { role, isLoading }
}
