import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { Image } from '@/components/ui/image'
import logo from '@/assets/images/homepage_logo.png'
import { useSettingsStore } from '@/stores/useSettingsStore'

export const RegisterPage = () => {
  const { t } = useTranslation('common')
  const { business } = useSettingsStore()

  return (
    <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <div className="fixed right-4 top-4 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <Image
        src={business.logoUrl || logo}
        alt="Punctual Logo"
        className="mb-8 h-32 w-32 md:h-48 md:w-48 rounded-md object-cover"
        aspectRatio="square"
      />
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>{t('app.name')}</CardTitle>
          <CardDescription>{t('app.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            <span>{t('auth.haveAccount')} </span>
            <Link to="/" className="text-primary hover:underline">
              {t('auth.login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
