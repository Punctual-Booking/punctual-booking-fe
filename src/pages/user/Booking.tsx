import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { Calendar } from '@/components/ui/calendar'
import { StaffAvatar } from '@/components/ui/staff-avatar'
import { CalendarCheck } from 'lucide-react'

export const BookingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff } = useBookingStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (!selectedService || !selectedStaff) {
      navigate({ to: '/user/services' })
      return
    }
  }, [selectedService, selectedStaff, navigate])

  const handleTimeSelect = (time: Date) => {
    // TODO: Implement time selection logic
    console.log('Selected time:', time)
    navigate({ to: '/user/confirmation' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('booking.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('booking.description')}</p>

        {/* Booking Summary */}
        {selectedStaff && selectedService && (
          <div className="mt-4 p-4 border rounded-md bg-muted/30">
            <p className="font-medium mb-3">{t('booking.summary')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Selected Staff */}
              <div className="flex items-center gap-3">
                <StaffAvatar
                  src={selectedStaff.image}
                  name={selectedStaff.name}
                  size="sm"
                />
                <div>
                  <p className="font-medium">{selectedStaff.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('staff.experience', {
                      years: selectedStaff.yearsOfExperience,
                    })}
                  </p>
                </div>
              </div>

              {/* Selected Service */}
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('common.currency', { value: selectedService.price })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('booking.selectDate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mx-auto"
                disabled={date => date < new Date()}
                initialFocus
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('booking.selectTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              {/* Generate time slots based on service duration */}
              {['09:00', '09:30', '10:00', '10:30'].map(time => (
                <Button
                  key={time}
                  variant="outline"
                  onClick={() =>
                    handleTimeSelect(new Date(`2024-01-01T${time}`))
                  }
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BookingPage
