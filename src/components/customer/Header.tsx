import { useEffect, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'

/**
 * Customer Header component - memoized to prevent unnecessary rerenders
 */
export const Header = memo(() => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const { business, fetchSettings } = useSettingsStore()
  const navigate = useNavigate()

  // Fetch settings only once on mount
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Memoize handlers to prevent recreating them on each render
  const startBooking = useCallback(() => {
    navigate({ to: '/user/staff-selection' })
  }, [navigate])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/user/dashboard"
            className="text-xl font-bold flex items-center gap-2"
          >
            {business.logoUrl && (
              <img
                src={business.logoUrl}
                alt={business.businessName}
                className="h-8 w-8 rounded-sm object-cover"
              />
            )}
            {business.businessName}
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/user/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              {t('nav.dashboard')}
            </Link>
            <Button
              variant="link"
              onClick={startBooking}
              className="text-sm font-medium"
            >
              {t('nav.bookAppointment')}
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={startBooking}
            className="md:hidden"
          >
            {t('nav.book')}
          </Button>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button variant="ghost" onClick={handleLogout}>
            {t('auth.logout')}
          </Button>
        </div>
      </div>
    </header>
  )
})
