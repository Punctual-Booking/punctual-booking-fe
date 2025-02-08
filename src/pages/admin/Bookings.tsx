import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card } from '@/components/ui/card'
import { useBookingStore } from '@/stores/useBookingStore'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Booking, CalendarEvent } from '@/types/booking'
import { BookingModal } from '@/components/admin/BookingModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export const BookingsPage = () => {
  const { t } = useTranslation()
  const { bookings, fetchBookings, isLoading, error } = useBookingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [defaultTimes, setDefaultTimes] = useState<{
    date?: string
    startTime?: string
    endTime?: string
  }>({})

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  console.log('Current bookings:', bookings)

  const calendarEvents = useMemo(
    () =>
      bookings.map(booking => ({
        id: booking.id,
        title: `${booking.customer.name} - ${booking.service.name}`,
        start: booking.startTime,
        end: booking.endTime,
        className: `status-${booking.status}`,
        extendedProps: {
          booking,
        },
      })),
    [bookings]
  )

  const handleEventClick = useCallback((info: any) => {
    const booking = info.event.extendedProps.booking
    setSelectedBooking(booking)
    setDefaultTimes({})
    setIsModalOpen(true)
  }, [])

  const handleSelect = useCallback((info: any) => {
    setSelectedBooking(null)
    setDefaultTimes({
      date: info.start.toISOString().split('T')[0],
    })
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
    setDefaultTimes({})
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('admin.bookings.title')}
      </h1>

      <Card className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[600px] overflow-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
              allDaySlot={false}
              nowIndicator={true}
              dayHeaders={true}
              weekNumbers={false}
              height="100%"
              expandRows={true}
              stickyHeaderDates={true}
              stickyFooterScrollbar={true}
              events={calendarEvents}
              eventMinHeight={20}
              eventShortHeight={30}
              selectable={true}
              selectMirror={true}
              editable={true}
            />
          </div>
        )}
      </Card>

      <BookingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        defaultDate={defaultTimes.date}
        defaultStartTime={defaultTimes.startTime}
        defaultEndTime={defaultTimes.endTime}
      />
    </div>
  )
}

export default BookingsPage
