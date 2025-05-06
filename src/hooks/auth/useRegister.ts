import { useMutation } from '@tanstack/react-query'
import { register as registerService } from '@/services/auth/register'

interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
}

/**
 * Hook for handling user registration
 * Uses TanStack Query for data mutation and caching
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    }: RegisterCredentials) =>
      registerService(
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation
      ),
    // Don't set user data on registration
    // Registration should only create the account, not authenticate the user
  })
}
