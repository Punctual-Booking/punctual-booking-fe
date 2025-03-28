import { useEffect, useState } from 'react'
import { User, UserRole } from '@/types/auth'
import { AUTH_ENDPOINTS, getDefaultFetchOptions } from '@/config/api'

export const useAuth = () => {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true)

        // Check if we have a token
        const token = localStorage.getItem('access_token')
        if (!token) {
          setRole(null)
          return
        }

        // Fetch user data from API
        const response = await fetch(AUTH_ENDPOINTS.ME, {
          ...getDefaultFetchOptions(true),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData: User = await response.json()
        setRole(userData.role)
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
