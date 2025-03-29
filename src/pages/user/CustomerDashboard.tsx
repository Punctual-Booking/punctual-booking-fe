import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { CalendarDays, Clock, Scissors, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { Loading } from '@/components/ui/loading'
import { useAppointments } from '@/hooks/appointments/useAppointments'
import { useEffect, useState } from 'react'
import { AppointmentResponseDto } from '@/types/appointment'
import { getUserAppointments } from '@/services/appointmentService'
import { queryClient } from '@/lib/queryClient'
import { User } from '@/types/auth'
import { mockLogin } from '@/mocks/mockAuthService'

const CustomerDashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [directLoading, setDirectLoading] = useState(false)
  const [directData, setDirectData] = useState<AppointmentResponseDto[]>([])
  const { upcomingAppointments, pastAppointments, isLoading, refetch, error } =
    useAppointments(user?.id)

  // Force login if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      console.log('CustomerDashboard - Initial auth check', {
        user,
        isAuthenticated,
      })

      // Debug: Check the user in the cache directly
      const cachedUser = queryClient.getQueryData<User>(['user'])
      console.log('CustomerDashboard - Cached user:', cachedUser)

      if (!isAuthenticated || !user) {
        console.log(
          'CustomerDashboard - Not authenticated, attempting to force login'
        )
        try {
          // Force a mock login
          const userData = await mockLogin('test@example.com', 'password')
          console.log('CustomerDashboard - Forced login succeeded:', userData)

          // Set the user data in the cache
          queryClient.setQueryData(['user'], userData)

          // Force refetch appointments after login
          setTimeout(() => {
            console.log(
              'CustomerDashboard - Refetching appointments after forced login'
            )
            refetch()
          }, 1000)
        } catch (err) {
          console.error('CustomerDashboard - Forced login failed:', err)
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, user, refetch])

  useEffect(() => {
    console.log('CustomerDashboard - user ID:', user?.id)

    if (user?.id) {
      console.log('Attempting to fetch appointments for user:', user.id)
      // Force a refetch when component mounts
      refetch()

      // Also try direct API call as fallback
      const fetchDirectData = async () => {
        try {
          setDirectLoading(true)
          const data = await getUserAppointments(user.id)
          console.log('Direct API call result:', data)
          setDirectData(data)
        } catch (err) {
          console.error('Error in direct API call:', err)
        } finally {
          setDirectLoading(false)
        }
      }

      fetchDirectData()
    }
  }, [user?.id, refetch])

  useEffect(() => {
    if (error) {
      console.error('Error fetching appointments:', error)
    }
  }, [error])

  useEffect(() => {
    console.log('Loaded appointments:', {
      upcoming: upcomingAppointments?.length,
      past: pastAppointments?.length,
    })
  }, [upcomingAppointments, pastAppointments])

  const handleNewBooking = () => {
    navigate({ to: '/user/services' })
  }

  if (isLoading || directLoading) {
    return (
      <Loading centered className="py-8" text={t('appointments.loading')} />
    )
  }

  // Use direct data if the hook failed
  const finalUpcomingAppointments = upcomingAppointments.length
    ? upcomingAppointments
    : directData
        .filter(a => new Date(a.appointmentTime) > new Date())
        .sort(
          (a, b) =>
            new Date(a.appointmentTime).getTime() -
            new Date(b.appointmentTime).getTime()
        )

  const finalPastAppointments = pastAppointments.length
    ? pastAppointments
    : directData
        .filter(a => new Date(a.appointmentTime) <= new Date())
        .sort(
          (a, b) =>
            new Date(b.appointmentTime).getTime() -
            new Date(a.appointmentTime).getTime()
        )

  if (
    error &&
    !finalUpcomingAppointments.length &&
    !finalPastAppointments.length
  ) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-red-500 mb-4">{t('appointments.error')}</p>
        <Button onClick={() => refetch()}>{t('common.retry')}</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('customer.dashboard.title')}</h1>
        <Button onClick={handleNewBooking}>
          {t('customer.dashboard.bookNew')}
        </Button>
      </div>

      {/* Next Upcoming Booking */}
      {finalUpcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('customer.dashboard.nextAppointment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex-1">
                  <h3 className="font-medium">
                    {finalUpcomingAppointments[0].service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Scissors className="h-4 w-4" />
                    <span>{finalUpcomingAppointments[0].staff.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {format(
                        new Date(finalUpcomingAppointments[0].appointmentTime),
                        'PPP'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(
                        new Date(finalUpcomingAppointments[0].appointmentTime),
                        'p'
                      )}{' '}
                      -
                      {format(
                        new Date(finalUpcomingAppointments[0].endTime),
                        'p'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('customer.dashboard.upcomingAppointments')}</CardTitle>
        </CardHeader>
        <CardContent>
          {finalUpcomingAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('customer.dashboard.noUpcoming')}
            </p>
          ) : (
            <div className="space-y-4">
              {finalUpcomingAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: '/booking-details/$id',
                      params: { id: appointment.id },
                    })
                  }
                >
                  <div>
                    <h3 className="font-medium">{appointment.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.appointmentTime), 'PPP')}
                      </span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>
                        {format(new Date(appointment.appointmentTime), 'p')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('customer.dashboard.pastAppointments')}</CardTitle>
        </CardHeader>
        <CardContent>
          {finalPastAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('customer.dashboard.noPast')}
            </p>
          ) : (
            <div className="space-y-4">
              {finalPastAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: '/booking-details/$id',
                      params: { id: appointment.id },
                    })
                  }
                >
                  <div>
                    <h3 className="font-medium">{appointment.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.appointmentTime), 'PPP')}
                      </span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>
                        {format(new Date(appointment.appointmentTime), 'p')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerDashboard
