import { forwardRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

interface FullCalendarProps {
  events: any[]
  view: string
  date: Date
  headerToolbar?: boolean | object
  allDaySlot?: boolean
  slotMinTime?: string
  slotMaxTime?: string
  slotDuration?: string
  eventClick?: (info: any) => void
  dateClick?: (info: any) => void
  eventDrop?: (info: any) => void
  eventResize?: (info: any) => void
  datesSet?: (info: any) => void
  [key: string]: any
}

export const FullCalendarComponent = forwardRef<
  FullCalendar,
  FullCalendarProps
>(
  (
    {
      events,
      view,
      date,
      headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      allDaySlot = true,
      slotMinTime = '00:00:00',
      slotMaxTime = '24:00:00',
      slotDuration = '00:30:00',
      eventClick,
      dateClick,
      eventDrop,
      eventResize,
      datesSet,
      ...rest
    },
    ref
  ) => {
    // Update the calendar view when the view prop changes
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        const calendarApi = ref.current.getApi()
        if (calendarApi.view.type !== view) {
          calendarApi.changeView(view)
        }
      }
    }, [view, ref])

    return (
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        initialDate={date}
        events={events}
        headerToolbar={headerToolbar}
        allDaySlot={allDaySlot}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        slotDuration={slotDuration}
        eventClick={eventClick}
        dateClick={dateClick}
        eventDrop={eventDrop}
        eventResize={eventResize}
        datesSet={datesSet}
        height="auto"
        {...rest}
      />
    )
  }
)

FullCalendarComponent.displayName = 'FullCalendar'
