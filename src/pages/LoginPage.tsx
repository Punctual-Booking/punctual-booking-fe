import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
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
import { Image } from '@/components/ui/image'
import logo from '@/assets/images/homepage_logo.png'

export const LoginPage = () => {
  const { t } = useTranslation('common')
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

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

  return (
    <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <LanguageSwitcher className="fixed right-4 top-4" />
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
            <div className="rounded-md bg-green-50 p-3 mb-4">
              <p className="text-sm font-medium text-green-800">
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
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
