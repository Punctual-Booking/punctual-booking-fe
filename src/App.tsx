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
import { Loading } from '@/components/ui/loading'
import { StaffCalendarPage } from './pages/admin/StaffCalendar'

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
const BookingDetails = lazy(() => import('@/pages/user/BookingDetails'))

function App() {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return <Loading centered className="h-screen" size="lg" />
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
                <Suspense fallback={<Loading centered />}>
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
                  <Suspense fallback={<Loading centered />}>
                    <AdminServicesPage />
                  </Suspense>
                }
              />
              <Route
                path="staff"
                element={
                  <Suspense fallback={<Loading centered />}>
                    <StaffPage />
                  </Suspense>
                }
              />
              <Route
                path="staff-calendar"
                element={
                  <Suspense fallback={<Loading centered />}>
                    <StaffCalendarPage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<Loading centered />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route
                path="bookings"
                element={
                  <Suspense fallback={<Loading centered />}>
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
                <Suspense fallback={<Loading centered />}>
                  <CustomerDashboard />
                </Suspense>
              }
            />
            <Route
              path="services"
              element={
                <Suspense fallback={<Loading centered />}>
                  <ServicesPage />
                </Suspense>
              }
            />
            <Route
              path="staff-selection"
              element={
                <Suspense fallback={<Loading centered />}>
                  <StaffSelectionPage />
                </Suspense>
              }
            />
            <Route
              path="booking"
              element={
                <Suspense fallback={<Loading centered />}>
                  <BookingPage />
                </Suspense>
              }
            />
            <Route
              path="confirmation"
              element={
                <Suspense fallback={<Loading centered />}>
                  <ConfirmationPage />
                </Suspense>
              }
            />
            <Route
              path="booking-success"
              element={
                <Suspense fallback={<Loading centered />}>
                  <BookingSuccessPage />
                </Suspense>
              }
            />
          </Route>

          {/* Booking details route */}
          <Route
            path="/booking-details/:id"
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
              index
              element={
                <Suspense fallback={<Loading centered />}>
                  <BookingDetails />
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
