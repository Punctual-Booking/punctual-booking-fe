import { memo } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Header } from '@/components/customer/Header'

interface CustomerLayoutProps {
  children?: React.ReactNode
}

/**
 * CustomerLayout component - memoized to prevent unnecessary rerenders
 */
export const CustomerLayout = memo(({ children }: CustomerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
    </div>
  )
})
