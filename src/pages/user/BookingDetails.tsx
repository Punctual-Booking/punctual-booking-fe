import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { format, addDays, startOfDay, isBefore, isAfter } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import {
  CalendarDays,
  Clock,
  Scissors,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { AppointmentStatus, AppointmentUpdateDto } from '@/types/appointment'
import { useAppointments } from '@/hooks/appointments/useAppointments'
import { useAppointment } from '@/hooks/appointments/useAppointment'
import { useAuth } from '@/hooks/auth'

// Mock available time slots
const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 18 // 6 PM
  const now = new Date()
  const isToday = startOfDay(date).getTime() === startOfDay(now).getTime()

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotTime = new Date(date)
      slotTime.setHours(hour, minute, 0, 0)

      // Skip times in the past for today
      if (isToday && isBefore(slotTime, now)) {
        continue
      }

      // Randomly mark some slots as unavailable (for demo purposes)
      const isAvailable = Math.random() > 0.3

      slots.push({
        time: slotTime,
        available: isAvailable,
      })
    }
  }

  return slots
}

const BookingDetails = () => {
  const { id } = useParams({ from: '/booking-details/$id' })
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { updateAppointment, cancelAppointment, isUpdating } = useAppointments(
    user?.id
  )

  // Use the new hook to fetch a single appointment by ID
  const { appointment: booking, isLoading, isError, error } = useAppointment(id)

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<
    { time: Date; available: boolean }[]
  >([])
  const [rescheduleStep, setRescheduleStep] = useState<'date' | 'time'>('date')

  // Get the current locale for date formatting
  const currentLocale = i18n.language === 'pt' ? pt : enUS

  // Generate time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate))
      setSelectedTime(undefined)
    }
  }, [selectedDate])

  // Log errors if any
  useEffect(() => {
    if (isError && error) {
      console.error('Error fetching booking details:', error)
    }
  }, [isError, error])

  // Function to format dates according to the current locale
  const formatDate = (date: Date | string, formatStr: string) => {
    return format(new Date(date), formatStr, { locale: currentLocale })
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-green-100 text-green-800 border-green-200'
      case AppointmentStatus.RESCHEDULED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case AppointmentStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return t('booking.status.confirmed')
      case AppointmentStatus.RESCHEDULED:
        return t('booking.status.pending')
      case AppointmentStatus.COMPLETED:
        return t('booking.status.completed')
      case AppointmentStatus.CANCELLED:
        return t('booking.status.cancelled')
      default:
        return status
    }
  }

  const handleBack = () => {
    navigate({ to: '/user/dashboard' })
  }

  const handleRescheduleClick = () => {
    setShowRescheduleDialog(true)
    setRescheduleStep('date')
    setSelectedDate(undefined)
    setSelectedTime(undefined)
  }

  const handleRescheduleDialogClose = () => {
    if (!isUpdating) {
      setShowRescheduleDialog(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setRescheduleStep('time')
    }
  }

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time)
  }

  const handleBackToDateSelection = () => {
    setRescheduleStep('date')
    setSelectedTime(undefined)
  }

  const handleRescheduleConfirm = () => {
    if (!booking || !selectedDate || !selectedTime) return

    // Update the appointment with the API
    updateAppointment({
      id: booking.id,
      data: {
        appointmentTime: selectedTime.toISOString(),
        status: AppointmentStatus.RESCHEDULED,
      },
    })

    // Close the dialog (the query will automatically refresh)
    setShowRescheduleDialog(false)
  }

  const handleCancelClick = () => {
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = () => {
    if (!booking) return

    // Cancel the appointment with the API
    cancelAppointment(booking.id)

    // Close the dialog (the query will automatically refresh)
    setShowCancelDialog(false)
  }

  const handleCancelDialogClose = () => {
    if (!isUpdating) {
      setShowCancelDialog(false)
    }
  }

  if (isLoading) {
    return <Loading centered className="py-8" />
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          {t('booking.notFound.title')}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t('booking.notFound.description')}
        </p>
        <Button onClick={() => navigate({ to: '/user/dashboard' })}>
          {t('common.backToDashboard')}
        </Button>
      </div>
    )
  }

  const isUpcoming = new Date(booking.startTime) > new Date()
  const canCancel = isUpcoming && booking.status !== AppointmentStatus.CANCELLED
  const canReschedule =
    isUpcoming &&
    (booking.status === AppointmentStatus.SCHEDULED ||
      booking.status === AppointmentStatus.RESCHEDULED)

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="flex items-center">
        <Button
          variant="default"
          size="sm"
          className="mr-4"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold">{t('booking.details.title')}</h1>
      </div>

      {/* Booking Status */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{t('booking.details.status')}</CardTitle>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {t('booking.details.bookingId')}: {booking.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Clock className="h-4 w-4" />
            <span>
              {t('booking.details.created')}:{' '}
              {formatDate(booking.createdAt, 'PPp')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('booking.details.serviceDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium text-lg">{booking.service.name}</h3>
            {booking.service.description && (
              <p className="text-muted-foreground mt-1">
                {booking.service.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-4">
              {booking.service.price !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(booking.service.price)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">{t('booking.details.dateAndTime')}</h3>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(booking.startTime, 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(booking.startTime, 'p')} -{' '}
                {formatDate(booking.endTime, 'p')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('booking.details.staffDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{booking.staff.name}</h3>
              {booking.staff.specialties && (
                <p className="text-sm text-muted-foreground">
                  {booking.staff.specialties.join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-border my-4"></div>

          <div className="space-y-2">
            {booking.staff.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.staff.phone}</span>
              </div>
            )}
            {booking.staff.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.staff.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle>{t('booking.details.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{booking.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {isUpcoming && (
        <Card>
          <CardHeader>
            <CardTitle>{t('booking.details.actions')}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {canReschedule && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRescheduleClick}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {t('booking.actions.reschedule')}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancelClick}
              >
                {t('booking.actions.cancel')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={handleCancelDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('booking.cancel.title')}</DialogTitle>
            <DialogDescription>
              {t('booking.cancel.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <h4 className="font-medium">{booking.service.name}</h4>
              <div className="mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(booking.startTime, 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDate(booking.startTime, 'p')} -{' '}
                    {formatDate(booking.endTime, 'p')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDialogClose}
              disabled={isUpdating}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="mr-2">{t('common.loading')}</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                t('booking.cancel.confirm')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={showRescheduleDialog}
        onOpenChange={handleRescheduleDialogClose}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('booking.reschedule.title')}</DialogTitle>
            <DialogDescription>
              {t('booking.reschedule.description')}
            </DialogDescription>
          </DialogHeader>

          {rescheduleStep === 'date' ? (
            <div className="py-4 space-y-4">
              <h3 className="font-medium">{t('booking.selectDate')}</h3>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={date =>
                    isBefore(date, startOfDay(new Date())) ||
                    isAfter(date, addDays(new Date(), 30))
                  }
                  className="rounded-md border"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBackToDateSelection}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('booking.backToDate')}
                </Button>
                <h3 className="font-medium">
                  {selectedDate && formatDate(selectedDate, 'PPP')}
                </h3>
              </div>

              <h3 className="font-medium">{t('booking.selectTime')}</h3>

              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedTime?.getTime() === slot.time.getTime()
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    disabled={!slot.available}
                    className={`${!slot.available ? 'opacity-50' : ''}`}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {formatDate(slot.time, 'p')}
                  </Button>
                ))}
              </div>

              {selectedTime && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium">
                    {t('booking.reschedule.summary')}
                  </h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedDate!, 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedTime, 'p')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleRescheduleDialogClose}
              disabled={isUpdating}
            >
              {t('common.cancel')}
            </Button>
            {rescheduleStep === 'time' && (
              <Button
                variant="default"
                onClick={handleRescheduleConfirm}
                disabled={isUpdating || !selectedTime}
              >
                {isUpdating ? (
                  <>
                    <span className="mr-2">{t('common.loading')}</span>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  t('booking.reschedule.confirm')
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingDetails
