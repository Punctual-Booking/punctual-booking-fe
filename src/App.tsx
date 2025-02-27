import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthPage } from '@/pages/AuthPage'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthGuard } from '@/components/auth/AuthGuard'
import '@/styles/globals.css'
import { useAuth } from '@/hooks/useAuth'
import { ThemeProvider } from '@/providers/ThemeProvider'

const ServicesPage = lazy(() => import('@/pages/admin/Services'))
const CustomersPage = lazy(() => import('@/pages/admin/Customers'))
const StaffPage = lazy(() => import('@/pages/admin/Staff'))
const SettingsPage = lazy(() => import('@/pages/admin/Settings'))
const BookingsPage = lazy(() => import('@/pages/admin/Bookings'))

function App() {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <AuthPage />
              </AuthGuard>
            }
          />

          {/* Admin Layout - Shared between admin and staff */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isAllowed={role === 'admin' || role === 'staff'}
                redirectPath="/"
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="customers"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CustomersPage />
                </Suspense>
              }
            />

            {/* Admin-only routes */}
            <Route
              element={
                <ProtectedRoute
                  isAllowed={role === 'admin'}
                  redirectPath="/admin"
                />
              }
            >
              <Route
                path="services"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ServicesPage />
                  </Suspense>
                }
              />
              <Route
                path="staff"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <StaffPage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route
                path="bookings"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <BookingsPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
