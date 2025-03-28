import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface AdminLayoutProps {
  children?: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
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
}
