import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { CheckCircle, CalendarClock } from 'lucide-react'
import { useAuth } from '@/hooks/auth'

export const BookingSuccessPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff, resetBooking } = useBookingStore()
  const { user } = useAuth()

  useEffect(() => {
    // If no service or staff is selected, redirect to services page
    if (!selectedService || !selectedStaff) {
      navigate({ to: '/user/services' })
    }

    // Reset booking data when unmounting
    return () => resetBooking()
  }, [selectedService, selectedStaff, navigate, resetBooking])

  const handleViewAppointments = () => {
    navigate({ to: '/user/dashboard' })
  }

  const handleNewBooking = () => {
    resetBooking()
    navigate({ to: '/user/services' })
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl">
            {t('confirmation.success.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {t('confirmation.success.description')}
          </p>

          {selectedService && selectedStaff && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                <h3 className="font-medium">{selectedService.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('confirmation.success.with')} {selectedStaff.name}
              </p>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {t('confirmation.success.emailSent')}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleNewBooking}>
              {t('common.backToServices')}
            </Button>
            <Button onClick={handleViewAppointments}>
              {t('confirmation.success.viewAppointments')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingSuccessPage
