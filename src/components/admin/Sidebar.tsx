import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  UserCog,
  X,
  type LucideIcon,
  Scissors,
  Calendar,
} from 'lucide-react'
import { Image } from '@/components/ui/image'
import favicon from '@/assets/images/favicon.png'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useState, useEffect } from 'react'
import { UserRole } from '@/types/auth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface SidebarItem {
  label: string
  icon: LucideIcon
  href: string
  adminOnly?: boolean
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const { business } = useSettingsStore()
  const [activePath, setActivePath] = useState(router.state.location.pathname)

  // Update active path when location changes
  useEffect(() => {
    // Update the active path on initial render
    setActivePath(router.state.location.pathname)

    // Listen for changes in the router state
    const unsubscribe = router.history.subscribe(() => {
      setActivePath(router.state.location.pathname)
    })

    return unsubscribe
  }, [router])

  const sidebarItems: SidebarItem[] = [
    {
      label: t('admin.sidebar.dashboard'),
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      label: t('admin.sidebar.bookings'),
      icon: CalendarDays,
      href: '/admin/bookings',
    },
    {
      label: t('admin.sidebar.staff'),
      icon: UserCog,
      href: '/admin/staff',
      adminOnly: true,
    },
    {
      label: t('admin.sidebar.staffCalendar'),
      icon: Calendar,
      href: '/admin/staff-calendar',
      adminOnly: true,
    },
    {
      label: t('admin.sidebar.services'),
      icon: Scissors,
      href: '/admin/services',
      adminOnly: true,
    },
    {
      label: t('admin.sidebar.customers'),
      icon: Users,
      href: '/admin/customers',
    },
    {
      label: t('admin.sidebar.settings'),
      icon: Settings,
      href: '/admin/settings',
      adminOnly: true,
    },
  ]

  const filteredItems = sidebarItems.filter(
    item => !item.adminOnly || user?.role === UserRole.ADMIN
  )

  const isActive = (href: string) => {
    // Check if it's the dashboard route
    if (
      href === '/admin/dashboard' &&
      (activePath === '/admin/' || activePath === '/admin')
    ) {
      return true
    }
    return activePath === href
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background',
          'transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              router.navigate({ to: '/admin/dashboard' })
              onClose()
            }}
          >
            {business.logoUrl ? (
              <Image
                src={business.logoUrl}
                alt={t('app.name')}
                className="h-8 w-8 rounded-sm object-cover"
                aspectRatio="square"
              />
            ) : (
              theme === 'light' && (
                <Image
                  src={favicon}
                  alt="Punctual Logo"
                  className="h-8 w-8"
                  aspectRatio="square"
                />
              )
            )}
            <span className="font-semibold">{t('app.name')}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {filteredItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Button
                key={item.href}
                variant={active ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', active && 'bg-secondary')}
                onClick={() => {
                  router.navigate({ to: item.href })
                  onClose()
                }}
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </div>
              </Button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
