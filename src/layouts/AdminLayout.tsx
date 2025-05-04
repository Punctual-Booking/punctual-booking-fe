import { useState, memo } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface AdminLayoutProps {
  children?: React.ReactNode
}

/**
 * AdminLayout component - memoized to prevent unnecessary rerenders
 */
export const AdminLayout = memo(({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handler is memoized within the component to prevent recreating on each render
  const handleOpenSidebar = () => setSidebarOpen(true)
  const handleCloseSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <div className="lg:pl-64">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={handleOpenSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Header>
        <main className="container py-6 lg:py-10">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
})
