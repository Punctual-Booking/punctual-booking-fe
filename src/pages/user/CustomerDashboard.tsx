import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { CalendarDays, Clock, Scissors, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

const CustomerDashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { userBookings, fetchUserBookings, isLoading } = useBookingStore()

  useEffect(() => {
    if (user?.id) {
      fetchUserBookings(user.id)
    }
  }, [user?.id, fetchUserBookings])

  const upcomingBookings = userBookings.filter(
    booking => new Date(booking.startTime) > new Date()
  )

  const pastBookings = userBookings.filter(
    booking => new Date(booking.startTime) <= new Date()
  )

  const handleNewBooking = () => {
    navigate('/user/services')
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
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
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('customer.dashboard.nextAppointment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex-1">
                  <h3 className="font-medium">
                    {upcomingBookings[0].service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Scissors className="h-4 w-4" />
                    <span>{upcomingBookings[0].staff.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {format(new Date(upcomingBookings[0].startTime), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(upcomingBookings[0].startTime), 'p')} -
                      {format(new Date(upcomingBookings[0].endTime), 'p')}
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
          {upcomingBookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('customer.dashboard.noUpcoming')}
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/booking-details/${booking.id}`)}
                >
                  <div>
                    <h3 className="font-medium">{booking.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(new Date(booking.startTime), 'PPP')}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{format(new Date(booking.startTime), 'p')}</span>
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
          {pastBookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('customer.dashboard.noPast')}
            </p>
          ) : (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/booking-details/${booking.id}`)}
                >
                  <div>
                    <h3 className="font-medium">{booking.service.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(new Date(booking.startTime), 'PPP')}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{format(new Date(booking.startTime), 'p')}</span>
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
