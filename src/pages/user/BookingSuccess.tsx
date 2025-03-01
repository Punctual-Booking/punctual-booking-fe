import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { CheckCircle } from 'lucide-react'

export const BookingSuccessPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff } = useBookingStore()

  useEffect(() => {
    if (!selectedService || !selectedStaff) {
      navigate('/user/services')
    }
  }, [selectedService, selectedStaff, navigate])

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl">
            {t('confirmation.success.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {t('confirmation.success.description')}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            {t('confirmation.success.emailSent')}
          </p>
          <Button className="w-full" onClick={() => navigate('/user/services')}>
            {t('common.backToServices')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingSuccessPage
