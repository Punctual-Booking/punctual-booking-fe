import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/common/FormInput'
import {
  createLoginSchema,
  type LoginFormData,
} from '@/utils/authentication/utils'
import { useAuthStore } from '@/stores/auth/useAuthStore'

export const LoginForm = () => {
  const { t } = useTranslation()
  const { login: loginUser, isLoading, error } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
  })

  const onSubmit = async (data: LoginFormData) => {
    await loginUser(data.email, data.password)
  }

  return (
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : t('auth.login')}
      </Button>
    </form>
  )
}
