import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/common/FormInput'
import {
  createLoginSchema,
  type LoginFormData,
} from '@/utils/authentication/utils'
import { useAuth } from '@/hooks/auth'
import { Loading } from '@/components/ui/loading'
import { Separator } from '@/components/ui/separator'
import { forwardRef } from 'react'

export const LoginForm = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation('common')
  const { login, isLoginLoading, error } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
  })

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password)
  }

  const handleSocialLogin = (provider: string) => {
    // For now, just log which provider was clicked
    console.log(`${provider} login clicked`)
    // In the future, this would redirect to the OAuth flow
  }

  // Format error message for display with translations
  const getErrorMessage = (error: string | null) => {
    if (!error) return null

    // Map backend error messages to translation keys
    if (error.includes('credentials') || error.includes('Invalid')) {
      return t('auth.errors.invalidCredentials', 'Invalid email or password')
    }

    // For server errors
    if (error.includes('500') || error.includes('server')) {
      return t(
        'auth.errors.serverError',
        'Server error, please try again later'
      )
    }

    // Default fallback
    return error
  }

  return (
    <div className="space-y-6" ref={ref}>
      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t('auth.continueWithGoogle', 'Continue with Google')}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('apple')}
          className="flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="14"
            height="14"
          >
            <path
              fill="currentColor"
              d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
            />
          </svg>
          {t('auth.continueWithApple', 'Continue with Apple')}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            width="14"
            height="14"
          >
            <path
              fill="#1877F2"
              d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
            />
          </svg>
          {t('auth.continueWithFacebook', 'Continue with Facebook')}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('auth.orContinueWith', 'or continue with')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex justify-end">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-muted-foreground"
            type="button"
            onClick={() => console.log('Forgot password clicked')}
          >
            {t('auth.forgotPassword', 'Forgot password?')}
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 dark:bg-destructive/25 p-3 border border-destructive/30 dark:border-destructive/40">
            <p className="text-sm font-medium text-destructive dark:text-red-400">
              {getErrorMessage(error)}
            </p>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoginLoading}>
          {isLoginLoading ? (
            <Loading size="sm" text="" className="justify-center" />
          ) : (
            t('auth.login')
          )}
        </Button>
      </form>
    </div>
  )
})

LoginForm.displayName = 'LoginForm'
