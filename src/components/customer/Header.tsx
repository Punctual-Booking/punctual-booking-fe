import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'

export const Header = () => {
  const { t } = useTranslation()
  const { logout } = useAuthStore()
  const { business, fetchSettings } = useSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/user/dashboard" className="text-xl font-bold">
          {business.businessName}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button variant="ghost" onClick={logout}>
            {t('auth.logout')}
          </Button>
        </div>
      </div>
    </header>
  )
}
