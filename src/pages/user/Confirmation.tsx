import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/useBookingStore'
import { format } from 'date-fns'
import { CalendarDays, Clock, Scissors } from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import { useAppointments } from '@/hooks/appointments/useAppointments'
import { Textarea } from '@/components/ui/textarea'
import { Loading } from '@/components/ui/loading'
import { StaffAvatar } from '@/components/ui/staff-avatar'

export const ConfirmationPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedService, selectedStaff } = useBookingStore()
  const [notes, setNotes] = useState('')
  const { user } = useAuth()
  const { createAppointment, isCreating } = useAppointments(user?.id)

  // For demonstration purposes, we'll use the current time
  // In the real implementation, this would come from the booking page
  const appointmentTime = new Date()
  // Move to next hour for demo
  appointmentTime.setHours(appointmentTime.getHours() + 1)
  appointmentTime.setMinutes(0)
  appointmentTime.setSeconds(0)
  appointmentTime.setMilliseconds(0)

  useEffect(() => {
    if (!selectedService || !selectedStaff) {
      navigate({ to: '/user/services' })
      return
    }
  }, [selectedService, selectedStaff, navigate])

  const handleConfirm = async () => {
    try {
      if (!selectedService || !selectedStaff || !user) {
        return
      }

      await createAppointment({
        staffId: selectedStaff.id,
        serviceId: selectedService.id,
        appointmentTime: appointmentTime.toISOString(),
        customerNotes: notes.trim() || undefined,
      })

      navigate({ to: '/user/booking-success' })
    } catch (error) {
      console.error('Error confirming booking:', error)
    }
  }

  if (isCreating) {
    return (
      <Loading centered className="py-8" text={t('confirmation.creating')} />
    )
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
          {/* Booking Summary */}
          <div className="p-4 border rounded-md bg-muted/30">
            <p className="font-medium mb-3">{t('booking.summary')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Selected Staff */}
              <div className="flex items-center gap-3">
                <StaffAvatar
                  src={selectedStaff?.image}
                  name={selectedStaff?.name || ''}
                  size="sm"
                />
                <div>
                  <p className="font-medium">{selectedStaff?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('staff.experience', {
                      years: selectedStaff?.yearsOfExperience,
                    })}
                  </p>
                </div>
              </div>

              {/* Selected Service */}
              <div className="flex items-center gap-3">
                <Scissors className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('common.currency', { value: selectedService?.price })}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {format(appointmentTime, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {format(appointmentTime, 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              {t('confirmation.notes')}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('confirmation.notesPlaceholder')}
              className="resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/user/staff-selection' })}
            >
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
