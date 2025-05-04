import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { Image } from '@/components/ui/image'
import logo from '@/assets/images/homepage_logo.png'
import { FEATURES } from '@/config'
import { useCurrentUser } from '@/hooks/auth'
import { UserRole } from '@/types/auth'

export const LoginPage = () => {
  const { t } = useTranslation('common')
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)
  const { isAuthenticated, user } = useCurrentUser()
  const navigate = useNavigate()

  // Check if we're coming from registration
  useEffect(() => {
    const registrationSuccess = sessionStorage.getItem('registrationSuccess')

    if (registrationSuccess === 'true') {
      // Clear from session storage immediately
      sessionStorage.removeItem('registrationSuccess')

      // Show success message
      setShowRegistrationSuccess(true)

      // Hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('LoginPage: User is authenticated, redirecting...')
      // Redirect based on user role
      if (user.role === UserRole.CUSTOMER) {
        navigate({ to: '/user/dashboard' })
      } else if (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) {
        navigate({ to: '/admin/dashboard' })
      }
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <div className="fixed right-4 top-4 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <Image
        src={logo}
        alt="Punctual Logo"
        className="mb-8 h-32 w-32 md:h-48 md:w-48"
        aspectRatio="square"
      />
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>{t('app.name')}</CardTitle>
          <CardDescription>{t('app.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {showRegistrationSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/40 p-3 mb-4 border border-green-200 dark:border-green-700">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {t('auth.registerSuccess')}
              </p>
            </div>
          )}
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            <span>{t('auth.noAccount')} </span>
            <Link to="/register" className="text-primary hover:underline">
              {t('auth.register')}
            </Link>
          </div>
          {FEATURES.MOCK_AUTH && (
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              <p className="mb-1 font-medium">Demo accounts:</p>
              <ul className="space-y-1">
                <li>
                  <span className="font-medium">Customer:</span>{' '}
                  customer@example.com
                </li>
                <li>
                  <span className="font-medium">Admin:</span> admin@example.com
                </li>
                <li>
                  <span className="font-medium">Staff:</span> staff@example.com
                </li>
                <li className="italic">(any password will work)</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
