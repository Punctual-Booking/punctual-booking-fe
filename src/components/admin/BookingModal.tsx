import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Booking } from '@/types/booking'
import { TimePicker } from '@/components/ui/time-picker'
import { format, parseISO } from 'date-fns'
import { useBookingStore } from '@/stores/useBookingStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  createBookingSchema,
  type BookingFormData,
} from '@/utils/bookings/validation'
import { Loading } from '@/components/ui/loading'

// Helper function to safely extract time from date string
const extractTimeFromDateString = (dateString?: string): string => {
  if (!dateString) return ''

  try {
    // Try to parse the date
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '' // Invalid date

    // Return formatted time
    return format(date, 'HH:mm')
  } catch (e) {
    console.error('Error formatting date:', e)
    return ''
  }
}

interface BookingModalProps {
  open: boolean
  onClose: () => void
  booking?: Booking | null
  defaultDate?: string
  defaultStartTime?: string
  defaultEndTime?: string
}

export const BookingModal = ({
  open,
  onClose,
  booking,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
}: BookingModalProps) => {
  const { t } = useTranslation()
  const { createBooking, updateBooking, isLoading, error } = useBookingStore()
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const schema = createBookingSchema(t)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTime:
        extractTimeFromDateString(booking?.startTime) ||
        extractTimeFromDateString(defaultStartTime) ||
        '',
      endTime:
        extractTimeFromDateString(booking?.endTime) ||
        extractTimeFromDateString(defaultEndTime) ||
        '',
    },
  })

  useEffect(() => {
    if (booking) {
      reset({
        customerId: booking.customer.id,
        serviceId: booking.service.id,
        staffId: booking.staff.id,
        startTime: extractTimeFromDateString(booking.startTime),
        endTime: extractTimeFromDateString(booking.endTime),
        notes: booking.notes,
      })
    } else if (defaultStartTime || defaultEndTime) {
      reset({
        startTime: extractTimeFromDateString(defaultStartTime),
        endTime: extractTimeFromDateString(defaultEndTime),
      })
    }
  }, [booking, defaultDate, defaultStartTime, defaultEndTime, reset])

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (booking) {
        await updateBooking(booking.id, data)
      } else {
        await createBooking(data)
      }
      reset()
      onClose()
    } catch (error) {
      console.error('Error saving booking:', error)
    }
  }

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {booking
                ? t('admin.bookings.editBooking')
                : t('admin.bookings.newBooking.desktop')}
            </DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.bookings.customer')}</Label>
              <Controller
                name="customerId"
                control={control}
                defaultValue={booking?.customer.id}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('admin.bookings.selectCustomer')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Add customers from API */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customerId && (
                <p className="text-sm text-destructive">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('admin.bookings.service')}</Label>
              <Controller
                name="serviceId"
                control={control}
                defaultValue={booking?.service.id}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('admin.bookings.selectService')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Add services from API */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.serviceId && (
                <p className="text-sm text-destructive">
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('admin.bookings.staff')}</Label>
              <Controller
                name="staffId"
                control={control}
                defaultValue={booking?.staff.id}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('admin.bookings.selectStaff')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Add staff from API */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.staffId && (
                <p className="text-sm text-destructive">
                  {errors.staffId.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('admin.bookings.startTime')}</Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      name={field.name}
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('admin.bookings.endTime')}</Label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      name={field.name}
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loading
                    size="sm"
                    text={t('common.saving')}
                    className="justify-center"
                  />
                ) : (
                  t('common.save')
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={open => setShowConfirmClose(open)}
        onConfirm={() => {
          setShowConfirmClose(false)
          reset()
          onClose()
        }}
        title={t('common.confirmClose')}
        description={t('common.confirmCloseDescription')}
      />
    </>
  )
}
