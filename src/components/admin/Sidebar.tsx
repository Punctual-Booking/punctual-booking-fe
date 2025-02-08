import { Link, useLocation } from 'react-router-dom'
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
} from 'lucide-react'
import { Image } from '@/components/ui/image'
import favicon from '@/assets/images/favicon.png'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

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
  const { pathname } = useLocation()
  const { role } = useAuth()

  const sidebarItems: SidebarItem[] = [
    {
      label: t('admin.sidebar.dashboard'),
      icon: LayoutDashboard,
      href: '/admin',
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
    item => !item.adminOnly || role === 'admin'
  )

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
          <Link to="/admin" className="flex items-center gap-2">
            {theme === 'light' && (
              <Image
                src={favicon}
                alt="Punctual Logo"
                className="h-8 w-8"
                aspectRatio="square"
              />
            )}
            <span className="font-semibold">{t('app.name')}</span>
          </Link>

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
            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  pathname === item.href && 'bg-secondary'
                )}
                asChild
                onClick={onClose}
              >
                <Link to={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
