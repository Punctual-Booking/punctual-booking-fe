import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth'
import { CalendarDays, Clock, Scissors, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import { Loading } from '@/components/ui/loading'
import { useAppointments } from '@/hooks/appointments/useAppointments'
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { AppointmentResponseDto } from '@/types/appointment'
import { getUserAppointments } from '@/services/appointmentService'
import { queryClient } from '@/lib/queryClient'
import { User } from '@/types/auth'
import { mockLogin } from '@/mocks/mockAuthService'

const CustomerDashboard = memo(() => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [directLoading, setDirectLoading] = useState(false)
  const [directData, setDirectData] = useState<AppointmentResponseDto[]>([])

  // Get user ID once and memoize it
  const userId = useMemo(() => user?.id, [user?.id])

  const { upcomingAppointments, pastAppointments, isLoading, refetch, error } =
    useAppointments(userId)

  // Get the current locale for date formatting - memoize this
  const currentLocale = useMemo(
    () => (i18n.language === 'pt' ? pt : enUS),
    [i18n.language]
  )

  // Memoize the format date function
  const formatDate = useCallback(
    (date: Date | string, formatStr: string) => {
      return format(new Date(date), formatStr, { locale: currentLocale })
    },
    [currentLocale]
  )

  // Force login if not authenticated - run only once on mount
  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      console.log('CustomerDashboard - Initial auth check', {
        user,
        isAuthenticated,
      })

      // Debug: Check the user in the cache directly
      const cachedUser = queryClient.getQueryData<User>(['user'])
      if (isMounted) {
        console.log('CustomerDashboard - Cached user:', cachedUser)
      }

      if (!isAuthenticated || !user) {
        console.log(
          'CustomerDashboard - Not authenticated, attempting to force login'
        )
        try {
          // Force a mock login
          const userData = await mockLogin('admin@example.com', 'password')
          if (isMounted) {
            console.log('CustomerDashboard - Forced login succeeded:', userData)

            // Set the user data in the cache
            queryClient.setQueryData(['user'], userData)

            // Force refetch appointments after login - use a reference instead of setTimeout
            refetch()
          }
        } catch (err) {
          if (isMounted) {
            console.error('CustomerDashboard - Forced login failed:', err)
          }
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
      setDirectData([])
    }
  }, []) // Empty dependency array to run only once

  // Fetch appointments - only when userId changes
  useEffect(() => {
    if (!userId) return

    console.log('CustomerDashboard - user ID:', userId)
    console.log('Attempting to fetch appointments for user:', userId)

    // Force a refetch when user ID changes
    refetch()

    // Direct API call as fallback
    let isMounted = true
    const fetchDirectData = async () => {
      try {
        setDirectLoading(true)
        const data = await getUserAppointments(userId)
        if (isMounted) {
          console.log('Direct API call result:', data)
          setDirectData(data)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in direct API call:', err)
        }
      } finally {
        if (isMounted) {
          setDirectLoading(false)
        }
      }
    }

    fetchDirectData()

    return () => {
      isMounted = false
    }
  }, [userId, refetch])

  // Log errors only when they change
  useEffect(() => {
    if (error) {
      console.error('Error fetching appointments:', error)
    }
  }, [error])

  // Log appointments counts when they change
  useEffect(() => {
    console.log('Loaded appointments:', {
      upcoming: upcomingAppointments?.length,
      past: pastAppointments?.length,
    })
  }, [upcomingAppointments?.length, pastAppointments?.length])

  // Memoize handlers to prevent recreating functions on each render
  const handleNewBooking = useCallback(() => {
    navigate({ to: '/user/services' })
  }, [navigate])

  const handleViewBookingDetails = useCallback(
    (id: string) => {
      navigate({ to: `/booking-details/${id}` })
    },
    [navigate]
  )

  // Memoize the final appointment arrays to prevent recalculation on each render
  const finalUpcomingAppointments = useMemo(() => {
    return upcomingAppointments.length
      ? upcomingAppointments
      : directData
          .filter(a => new Date(a.appointmentTime) > new Date())
          .sort(
            (a, b) =>
              new Date(a.appointmentTime).getTime() -
              new Date(b.appointmentTime).getTime()
          )
  }, [upcomingAppointments, directData])

  const finalPastAppointments = useMemo(() => {
    return pastAppointments.length
      ? pastAppointments
      : directData
          .filter(a => new Date(a.appointmentTime) <= new Date())
          .sort(
            (a, b) =>
              new Date(b.appointmentTime).getTime() -
              new Date(a.appointmentTime).getTime()
          )
  }, [pastAppointments, directData])

  if (isLoading || directLoading) {
    return (
      <Loading centered className="py-8" text={t('appointments.loading')} />
    )
  }

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
              <div
                className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() =>
                  handleViewBookingDetails(finalUpcomingAppointments[0].id)
                }
              >
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
                      {formatDate(
                        finalUpcomingAppointments[0].appointmentTime,
                        'PPP'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDate(
                        finalUpcomingAppointments[0].appointmentTime,
                        'p'
                      )}{' '}
                      -{formatDate(finalUpcomingAppointments[0].endTime, 'p')}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={e => {
                    e.stopPropagation()
                    handleViewBookingDetails(finalUpcomingAppointments[0].id)
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Upcoming Appointments */}
      {finalUpcomingAppointments.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t('customer.dashboard.upcomingAppointments')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {finalUpcomingAppointments.slice(1).map(appointment => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => handleViewBookingDetails(appointment.id)}
                >
                  <div>
                    <h3 className="font-medium">{appointment.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {formatDate(
                          new Date(appointment.appointmentTime),
                          'PPP'
                        )}
                      </span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>
                        {formatDate(new Date(appointment.appointmentTime), 'p')}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation()
                      handleViewBookingDetails(appointment.id)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Appointments */}
      {finalPastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('customer.dashboard.pastAppointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {finalPastAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/20 cursor-pointer transition-colors opacity-70"
                  onClick={() => handleViewBookingDetails(appointment.id)}
                >
                  <div>
                    <h3 className="font-medium">{appointment.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {formatDate(
                          new Date(appointment.appointmentTime),
                          'PPP'
                        )}
                      </span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>
                        {formatDate(new Date(appointment.appointmentTime), 'p')}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation()
                      handleViewBookingDetails(appointment.id)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

// Add a display name to help with debugging
CustomerDashboard.displayName = 'CustomerDashboard'

export default CustomerDashboard
