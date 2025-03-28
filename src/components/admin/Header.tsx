import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface HeaderProps {
  children?: React.ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { businessName } = useSettingsStore()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center gap-2">
          {children}
          <span className="text-sm font-medium mr-2">{businessName}</span>
          <span className="hidden md:inline text-sm text-muted-foreground">
            {t('admin.welcome', { name: user?.name })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={logout}>
            {t('auth.logout')}
          </Button>
        </div>
      </div>
    </header>
  )
}
