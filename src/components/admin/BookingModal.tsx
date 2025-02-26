import { useForm } from 'react-hook-form'
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
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Booking } from '@/types/booking'
import { TimePicker } from '@/components/ui/time-picker'
import { format } from 'date-fns'
import { useBookingStore } from '@/stores/useBookingStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  createBookingSchema,
  type BookingFormData,
} from '@/utils/bookings/validation'

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
    formState: { errors, isDirty },
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (booking) {
      reset({
        customerId: booking.customer.id,
        serviceId: booking.service.id,
        staffId: booking.staff.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        notes: booking.notes,
      })
    } else if (defaultDate && defaultStartTime && defaultEndTime) {
      reset({
        startTime: defaultStartTime,
        endTime: defaultEndTime,
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
                : t('admin.bookings.newBooking')}
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
              <Select
                defaultValue={booking?.customer.id}
                {...register('customerId')}
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
              {errors.customerId && (
                <p className="text-sm text-destructive">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('admin.bookings.service')}</Label>
              <Select
                defaultValue={booking?.service.id}
                {...register('serviceId')}
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
              {errors.serviceId && (
                <p className="text-sm text-destructive">
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('admin.bookings.staff')}</Label>
              <Select defaultValue={booking?.staff.id} {...register('staffId')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.bookings.selectStaff')} />
                </SelectTrigger>
                <SelectContent>{/* TODO: Add staff from API */}</SelectContent>
              </Select>
              {errors.staffId && (
                <p className="text-sm text-destructive">
                  {errors.staffId.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('admin.bookings.startTime')}</Label>
                <TimePicker
                  value={format(
                    new Date(
                      booking?.startTime || defaultStartTime || Date.now()
                    ),
                    'HH:mm'
                  )}
                  onChange={value => {
                    register('startTime').onChange({ target: { value } })
                  }}
                  name={register('startTime').name}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.bookings.endTime')}</Label>
                <TimePicker
                  value={format(
                    new Date(booking?.endTime || defaultEndTime || Date.now()),
                    'HH:mm'
                  )}
                  onChange={value => {
                    register('endTime').onChange({ target: { value } })
                  }}
                  name={register('endTime').name}
                />
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
                {isLoading ? t('common.saving') : t('common.save')}
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
