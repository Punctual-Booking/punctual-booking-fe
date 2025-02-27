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
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { UserRole } from '@/types/auth'

// Admin pages
const AdminServicesPage = lazy(() => import('@/pages/admin/Services'))
const CustomersPage = lazy(() => import('@/pages/admin/Customers'))
const StaffPage = lazy(() => import('@/pages/admin/Staff'))
const SettingsPage = lazy(() => import('@/pages/admin/Settings'))
const BookingsPage = lazy(() => import('@/pages/admin/Bookings'))

// Customer pages
const ServicesPage = lazy(() => import('@/pages/user/Services'))
const StaffSelectionPage = lazy(() => import('@/pages/user/StaffSelection'))
const BookingPage = lazy(() => import('@/pages/user/Booking'))
const ConfirmationPage = lazy(() => import('@/pages/user/Confirmation'))
const BookingSuccessPage = lazy(() => import('@/pages/user/BookingSuccess'))
const CustomerDashboard = lazy(() => import('@/pages/user/CustomerDashboard'))

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
                isAllowed={role === UserRole.ADMIN || role === UserRole.STAFF}
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
                  isAllowed={role === UserRole.ADMIN}
                  redirectPath="/admin"
                />
              }
            >
              <Route
                path="services"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <AdminServicesPage />
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

          {/* Customer routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute
                isAllowed={role === UserRole.USER}
                redirectPath="/"
              >
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CustomerDashboard />
                </Suspense>
              }
            />
            <Route
              path="services"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ServicesPage />
                </Suspense>
              }
            />
            <Route
              path="staff-selection"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <StaffSelectionPage />
                </Suspense>
              }
            />
            <Route
              path="booking"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BookingPage />
                </Suspense>
              }
            />
            <Route
              path="confirmation"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ConfirmationPage />
                </Suspense>
              }
            />
            <Route
              path="booking-success"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BookingSuccessPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
