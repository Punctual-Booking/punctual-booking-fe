import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt'
import enLocale from '@fullcalendar/core/locales/en-gb'
import { Card } from '@/components/ui/card'
import { useBookingStore } from '@/stores/useBookingStore'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Booking } from '@/types/booking'
import { BookingModal } from '@/components/admin/BookingModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, Info } from 'lucide-react'
import { EventInput } from '@fullcalendar/core'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const BookingsPage = () => {
  const { t, i18n } = useTranslation()
  const { bookings, fetchBookings, isLoading, error } = useBookingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [defaultTimes, setDefaultTimes] = useState<{
    date?: string
    startTime?: string
    endTime?: string
  }>({})

  const currentLocale = i18n.language === 'pt' ? ptLocale : enLocale

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const calendarEvents: EventInput[] = useMemo(
    () =>
      bookings.map(booking => ({
        id: booking.id,
        title: booking.customer.name,
        extendedProps: {
          booking,
        },
        start: booking.startTime,
        end: booking.endTime,
        className: `status-${booking.status}`,
        display: 'block',
        backgroundColor: 'white',
        textColor: 'black',
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
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('admin.bookings.title')}
          </h1>
          <Button
            onClick={() => {
              setSelectedBooking(null)
              setDefaultTimes({})
              setIsModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.bookings.newBooking')}
          </Button>
        </div>

        <Card className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="h-[600px] flex flex-col">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={currentLocale}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                dayHeaderFormat={{
                  weekday: 'long',
                  day: 'numeric',
                  omitCommas: true,
                }}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                slotDuration="00:30:00"
                slotLabelFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: false,
                }}
                allDaySlot={false}
                nowIndicator={true}
                scrollTime="06:00:00"
                height="100%"
                expandRows={true}
                events={calendarEvents}
                stickyHeaderDates={true}
                eventMinHeight={20}
                eventShortHeight={30}
                selectable={true}
                selectMirror={true}
                editable={false}
                eventClick={handleEventClick}
                select={handleSelect}
                eventContent={info => {
                  const booking = info.event.extendedProps.booking
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-full w-full p-1 overflow-hidden group">
                          <div className="flex items-center gap-1">
                            <div className="font-medium">
                              {booking.customer.name}
                            </div>
                            <Info className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.service.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.staff.name}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        className="p-2 space-y-1"
                      >
                        <p className="font-medium">{booking.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.customer.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.customer.email}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs font-medium">
                            {booking.service.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.staff.name}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                }}
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
    </TooltipProvider>
  )
}

export default BookingsPage
