import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/common/FormInput'
import {
  createRegisterSchema,
  type RegisterFormData,
} from '@/utils/authentication/utils'
import { useAuth } from '@/hooks/auth'
import { Loading } from '@/components/ui/loading'

export const RegisterForm = () => {
  const { t } = useTranslation('common')
  const { register: registerUser, isRegisterLoading, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(t)),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.passwordConfirmation
      )

      if (success) {
        // Store registration success for login page to display
        sessionStorage.setItem('registrationSuccess', 'true')

        // Navigate to login page
        navigate({ to: '/', replace: true })
      }
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  // Format error message for display with translations
  const getErrorMessage = (error: string | null) => {
    if (!error) return null

    // Map backend error messages to translation keys
    if (error.includes('Username already exists')) {
      return t('auth.errors.usernameExists')
    }

    if (error.includes('passwords')) {
      return t('auth.errors.passwordMismatch')
    }

    // For server errors
    if (error.includes('500') || error.includes('server')) {
      return t('auth.errors.serverError')
    }

    // Default fallback
    return error
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          type="text"
          label={t('auth.firstName')}
          translationKey="firstName"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormInput
          id="lastName"
          type="text"
          label={t('auth.lastName')}
          translationKey="lastName"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <FormInput
        id="email"
        type="email"
        label={t('auth.email')}
        translationKey="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormInput
        id="password"
        type="password"
        label={t('auth.password')}
        translationKey="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <FormInput
        id="passwordConfirmation"
        type="password"
        label={t('auth.passwordConfirmation')}
        translationKey="passwordConfirmation"
        error={errors.passwordConfirmation?.message}
        {...register('passwordConfirmation')}
      />
      {error && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-sm font-medium text-destructive">
            {getErrorMessage(error)}
          </p>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isRegisterLoading}>
        {isRegisterLoading ? (
          <Loading size="sm" text="" className="justify-center" />
        ) : (
          t('auth.register')
        )}
      </Button>
    </form>
  )
}
