import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { CheckCircle, Scissors } from 'lucide-react'
import { StaffAvatar } from '@/components/ui/staff-avatar'

export const BookingSuccessPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff, resetBooking } = useBookingStore()

  useEffect(() => {
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
              <p className="font-medium mb-3">{t('booking.summary')}</p>
              <div className="space-y-3">
                {/* Service */}
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedService.name}</span>
                </div>

                {/* Staff */}
                <div className="flex items-center gap-2">
                  <StaffAvatar
                    src={selectedStaff.image}
                    name={selectedStaff.name}
                    size="sm"
                  />
                  <span>
                    {t('confirmation.success.with')}{' '}
                    <span className="font-medium">{selectedStaff.name}</span>
                  </span>
                </div>
              </div>
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
