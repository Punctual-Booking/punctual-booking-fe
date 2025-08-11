import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Image } from '@/components/ui/image'

interface HeaderProps {
  children?: React.ReactNode
}

/**
 * Admin Header component - memoized to prevent unnecessary rerenders
 */
export const Header = memo(({ children }: HeaderProps) => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { businessName, business } = useSettingsStore()

  // Memoize the logout handler to prevent recreating on each render
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center gap-2">
          {children}
          <span className="text-sm font-medium mr-2 flex items-center gap-2">
            {business.logoUrl && (
              <Image
                src={business.logoUrl}
                alt={businessName}
                className="h-6 w-6 rounded-sm object-cover"
                aspectRatio="square"
              />
            )}
            {businessName}
          </span>
          <span className="hidden md:inline text-sm text-muted-foreground">
            {t('admin.welcome', { name: user?.name })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            {t('auth.logout')}
          </Button>
        </div>
      </div>
    </header>
  )
})
