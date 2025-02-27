import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { format } from 'date-fns'
import { CalendarDays, Clock, Scissors, User } from 'lucide-react'

export const ConfirmationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff } = useBookingStore()

  useEffect(() => {
    if (!selectedService || !selectedStaff) {
      navigate('/user/services')
      return
    }
  }, [selectedService, selectedStaff, navigate])

  const handleConfirm = async () => {
    try {
      // TODO: Implement booking confirmation
      console.log('Booking confirmed')
      navigate('/user/booking-success')
    } catch (error) {
      console.error('Error confirming booking:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('confirmation.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('confirmation.description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('confirmation.bookingDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Scissors className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t('common.currency', { value: selectedService?.price })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedStaff?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t('staff.experience', {
                    years: selectedStaff?.yearsOfExperience,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{format(new Date(), 'HH:mm')}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('common.back')}
            </Button>
            <Button onClick={handleConfirm}>{t('confirmation.confirm')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmationPage
