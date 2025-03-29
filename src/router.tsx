import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { UserRole, User } from '@/types/auth'
import { StaffCalendarPage } from '@/pages/admin/StaffCalendar'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { Loading } from '@/components/ui/loading'
import { lazy, Suspense } from 'react'
import { queryClient } from '@/lib/queryClient'

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

// Lazy load our test page
const AppointmentTest = lazy(() => import('@/pages/AppointmentTest'))

// Helper function to check auth state from the query cache
const getAuthState = () => {
  const user = queryClient.getQueryData<User>(['user'])
  const isAuthenticated = !!user
  return { isAuthenticated, user }
}

// Create root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Auth routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = getAuthState()
    console.log('isAuthenticated', isAuthenticated)
    console.log('user', user)
    if (isAuthenticated) {
      if (user?.role === UserRole.CUSTOMER) {
        throw redirect({ to: '/user/dashboard' })
      } else if (
        user?.role === UserRole.ADMIN ||
        user?.role === UserRole.STAFF
      ) {
        throw redirect({ to: '/admin/dashboard' })
      }
    }
    return {}
  },
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
  beforeLoad: () => {
    const { isAuthenticated, user } = getAuthState()
    if (isAuthenticated) {
      if (user?.role === UserRole.CUSTOMER) {
        throw redirect({ to: '/user/dashboard' })
      } else if (
        user?.role === UserRole.ADMIN ||
        user?.role === UserRole.STAFF
      ) {
        throw redirect({ to: '/admin/dashboard' })
      }
    }
    return {}
  },
})

// Create a test route that doesn't require authentication
const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <AppointmentTest />
    </Suspense>
  ),
})

// Admin routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
  beforeLoad: () => {
    const { isAuthenticated, user } = getAuthState()
    if (
      !isAuthenticated ||
      !(user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF)
    ) {
      throw redirect({ to: '/' })
    }
    return {}
  },
})

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'dashboard',
  component: AdminDashboard,
})

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/customers',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <CustomersPage />
    </Suspense>
  ),
})

const adminServicesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/services',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <AdminServicesPage />
    </Suspense>
  ),
  beforeLoad: () => {
    const { user } = getAuthState()
    if (user?.role !== UserRole.ADMIN) {
      throw redirect({ to: '/admin' })
    }
    return {}
  },
})

const adminStaffRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/staff',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <StaffPage />
    </Suspense>
  ),
  beforeLoad: () => {
    const { user } = getAuthState()
    if (user?.role !== UserRole.ADMIN) {
      throw redirect({ to: '/admin' })
    }
    return {}
  },
})

const adminStaffCalendarRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/staff-calendar',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <StaffCalendarPage />
    </Suspense>
  ),
  beforeLoad: () => {
    const { user } = getAuthState()
    if (user?.role !== UserRole.ADMIN) {
      throw redirect({ to: '/admin' })
    }
    return {}
  },
})

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <SettingsPage />
    </Suspense>
  ),
  beforeLoad: () => {
    const { user } = getAuthState()
    if (user?.role !== UserRole.ADMIN) {
      throw redirect({ to: '/admin' })
    }
    return {}
  },
})

const adminBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/bookings',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <BookingsPage />
    </Suspense>
  ),
  beforeLoad: () => {
    const { user } = getAuthState()
    if (user?.role !== UserRole.ADMIN) {
      throw redirect({ to: '/admin' })
    }
    return {}
  },
})

// Customer routes
const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user',
  component: CustomerLayout,
  beforeLoad: () => {
    const { isAuthenticated, user } = getAuthState()
    if (!isAuthenticated || user?.role !== UserRole.CUSTOMER) {
      throw redirect({ to: '/' })
    }
    return {}
  },
})

const customerDashboardRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <CustomerDashboard />
    </Suspense>
  ),
})

const customerServicesRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/services',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <ServicesPage />
    </Suspense>
  ),
})

const customerStaffSelectionRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/staff-selection',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <StaffSelectionPage />
    </Suspense>
  ),
})

const customerBookingRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/booking',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <BookingPage />
    </Suspense>
  ),
})

const customerConfirmationRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/confirmation',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <ConfirmationPage />
    </Suspense>
  ),
})

const customerBookingSuccessRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/booking-success',
  component: () => (
    <Suspense fallback={<Loading centered />}>
      <BookingSuccessPage />
    </Suspense>
  ),
})

const bookingDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking-details/$id',
  component: () => {
    return (
      <Suspense fallback={<Loading centered />}>
        <CustomerLayout>
          <BookingDetails />
        </CustomerLayout>
      </Suspense>
    )
  },
  beforeLoad: () => {
    const { isAuthenticated, user } = getAuthState()
    if (!isAuthenticated || user?.role !== UserRole.CUSTOMER) {
      throw redirect({ to: '/' })
    }
    return {}
  },
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  testRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminCustomersRoute,
    adminServicesRoute,
    adminStaffRoute,
    adminStaffCalendarRoute,
    adminSettingsRoute,
    adminBookingsRoute,
  ]),
  customerLayoutRoute.addChildren([
    customerDashboardRoute,
    customerServicesRoute,
    customerStaffSelectionRoute,
    customerBookingRoute,
    customerConfirmationRoute,
    customerBookingSuccessRoute,
  ]),
  bookingDetailsRoute,
])

// Create the router
export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
