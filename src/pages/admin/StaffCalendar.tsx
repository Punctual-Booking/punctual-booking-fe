import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { StaffMember } from '@/types/staff'
import ptLocale from '@fullcalendar/core/locales/pt'
import { BUSINESS_ID } from '@/config'
import { cn } from '@/lib/utils'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DatesSetArg } from '@fullcalendar/core'

// Mock data for staff members
const mockStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+351 912 345 678',
    specialties: ['Hair', 'Makeup'],
    services: ['Haircut', 'Styling'],
    yearsOfExperience: 5,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+351 923 456 789',
    specialties: ['Nails', 'Skincare'],
    services: ['Manicure', 'Facial'],
    yearsOfExperience: 3,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+351 934 567 890',
    specialties: ['Massage', 'Skincare'],
    services: ['Swedish Massage', 'Deep Tissue'],
    yearsOfExperience: 7,
    isActive: false,
    businessId: BUSINESS_ID,
  },
]

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    title: 'Haircut - Maria Santos',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    staffId: '1',
    resourceId: '1',
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Styling - João Silva',
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    staffId: '1',
    resourceId: '1',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Manicure - Ana Costa',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    staffId: '2',
    resourceId: '2',
    status: 'confirmed',
  },
  {
    id: '4',
    title: 'Facial - Pedro Oliveira',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    staffId: '2',
    resourceId: '2',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Massage - Sofia Martins',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    staffId: '3',
    resourceId: '3',
    status: 'cancelled',
  },
]

// Define staff colors at the component level so they can be used in multiple places
const staffColors = [
  'bg-blue-50 border-blue-200 text-black',
  'bg-green-50 border-green-200 text-black',
  'bg-purple-50 border-purple-200 text-black',
  'bg-amber-50 border-amber-200 text-black',
  'bg-pink-50 border-pink-200 text-black',
  'bg-indigo-50 border-indigo-200 text-black',
]

// Helper function to get staff color
const getStaffColor = (staffId: string) => {
  const staffIndex = parseInt(staffId) - 1
  return staffColors[staffIndex % staffColors.length]
}

export const StaffCalendarPage = () => {
  const { t, i18n } = useTranslation()
  const [view, setView] = useState('timeGridDay')
  const [date, setDate] = useState(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const calendarRef = useRef(null)

  // Filter bookings based on selected staff
  useEffect(() => {
    if (selectedStaff.length === 0) {
      setFilteredBookings(mockBookings)
    } else {
      setFilteredBookings(
        mockBookings.filter(booking => selectedStaff.includes(booking.staffId))
      )
    }
  }, [selectedStaff])

  // Handle staff selection
  const handleStaffChange = (staffId: string) => {
    setSelectedStaff(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId)
      } else {
        return [...prev, staffId]
      }
    })
  }

  // Handle view all staff
  const handleViewAll = () => {
    setSelectedStaff(mockStaffMembers.map(staff => staff.id))
  }

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedStaff([])
  }

  // Navigate to previous day/week/month
  const handlePrevious = () => {
    if (calendarRef.current) {
      const calendar = calendarRef.current as any
      calendar.getApi().prev()
      setDate(calendar.getApi().getDate())
    }
  }

  // Navigate to next day/week/month
  const handleNext = () => {
    if (calendarRef.current) {
      const calendar = calendarRef.current as any
      calendar.getApi().next()
      setDate(calendar.getApi().getDate())
    }
  }

  // Navigate to today
  const handleToday = () => {
    if (calendarRef.current) {
      const calendar = calendarRef.current as any
      calendar.getApi().today()
      setDate(calendar.getApi().getDate())
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language === 'pt' ? 'pt-PT' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Helper function to format event title for better readability
  const formatEventTitle = (serviceName: string, customerName: string) => {
    return {
      service: serviceName || t('calendar.event.defaultService'),
      customer: customerName || t('calendar.event.defaultCustomer'),
    }
  }

  const renderEventContent = (info: any) => {
    // Extract the title which contains both service and customer name
    const title = info.event.title
    const titleParts = title.split(' - ')
    const { service: serviceName, customer: customerName } = formatEventTitle(
      titleParts[0],
      titleParts[1]
    )

    // Find staff member
    const staffId = info.event.extendedProps.staffId
    const staff = mockStaffMembers.find(s => s.id === staffId)

    // Get color for this staff member
    const colorClass = getStaffColor(staffId)

    // Check if we're in month view
    const isMonthView = info.view.type === 'dayGridMonth'

    // Render a more compact version for month view
    if (isMonthView) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`group h-full w-full rounded-md border-0 py-0.5 px-1.5 text-xs overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${colorClass}`}
            >
              <div className="truncate font-medium group-hover:text-foreground transition-colors">
                {customerName}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="start"
            sideOffset={8}
            className="p-0 border shadow-lg bg-card"
          >
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-2 text-foreground">
                {customerName}
              </h3>
              <div className="text-xs text-foreground space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black font-medium">
                    {t('calendar.service')}:
                  </span>
                  <span className="font-medium">{serviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black font-medium">
                    {t('calendar.staff')}:
                  </span>
                  <span>{staff?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black font-medium">
                    {t('calendar.status')}:
                  </span>
                  <span
                    className={`text-xs font-medium status-text-${info.event.extendedProps.status}`}
                  >
                    {(() => {
                      switch (info.event.extendedProps.status) {
                        case 'confirmed':
                          return t('calendar.status.confirmed')
                        case 'pending':
                          return t('calendar.status.pending')
                        case 'completed':
                          return t('calendar.status.completed')
                        case 'cancelled':
                          return t('calendar.status.cancelled')
                        default:
                          return ''
                      }
                    })()}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black font-medium">
                      {t('calendar.time')}:
                    </span>
                    <span>
                      {new Date(info.event.start).toLocaleTimeString(
                        i18n.language === 'pt' ? 'pt-PT' : 'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        }
                      )}{' '}
                      -{' '}
                      {new Date(info.event.end).toLocaleTimeString(
                        i18n.language === 'pt' ? 'pt-PT' : 'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }

    // Regular view for day and week views
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`group h-full w-full rounded-md border-0 p-2 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${colorClass} status-${info.event.extendedProps.status}`}
          >
            <div className="flex items-center gap-1">
              <div className="font-medium truncate transition-colors">
                {customerName}
              </div>
              <Info className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
              <div className="text-xs truncate text-black transition-colors">
                {serviceName}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30"></div>
              <div className="text-xs truncate text-black">{staff?.name}</div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          sideOffset={8}
          className="p-0 border shadow-lg bg-card"
        >
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-2 text-foreground">
              {customerName}
            </h3>
            <div className="text-xs text-foreground space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black font-medium">
                  {t('calendar.service')}:
                </span>
                <span className="font-medium">{serviceName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black font-medium">
                  {t('calendar.staff')}:
                </span>
                <span>{staff?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black font-medium">
                  {t('calendar.status')}:
                </span>
                <span
                  className={`text-xs font-medium status-text-${info.event.extendedProps.status}`}
                >
                  {(() => {
                    switch (info.event.extendedProps.status) {
                      case 'confirmed':
                        return t('calendar.status.confirmed')
                      case 'pending':
                        return t('calendar.status.pending')
                      case 'completed':
                        return t('calendar.status.completed')
                      case 'cancelled':
                        return t('calendar.status.cancelled')
                      default:
                        return ''
                    }
                  })()}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black font-medium">
                    {t('calendar.time')}:
                  </span>
                  <span>
                    {new Date(info.event.start).toLocaleTimeString(
                      i18n.language === 'pt' ? 'pt-PT' : 'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }
                    )}{' '}
                    -{' '}
                    {new Date(info.event.end).toLocaleTimeString(
                      i18n.language === 'pt' ? 'pt-PT' : 'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  const getEventClassNames = (info: any) => {
    const staffId = info.event.extendedProps.staffId
    const status = info.event.extendedProps.status
    return [getStaffColor(staffId), `status-${status}`]
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('admin.staffCalendar.title')}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              {t('calendar.today')}
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('calendar.day')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeGridDay">{t('calendar.day')}</SelectItem>
                <SelectItem value="timeGridWeek">
                  {t('calendar.week')}
                </SelectItem>
                <SelectItem value="dayGridMonth">
                  {t('calendar.month')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <CardTitle>{formatDate(date)}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleViewAll}>
                  {t('admin.staffCalendar.viewAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  {t('admin.staffCalendar.clearSelection')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-4 md:col-span-1">
                <h3 className="font-medium">
                  {t('admin.staffCalendar.selectStaff')}
                </h3>
                <div className="space-y-2">
                  {mockStaffMembers.map(staff => {
                    const colorClass = getStaffColor(staff.id)
                    const colorParts = colorClass.split(' ')
                    const bgColor = colorParts[0]
                    const borderColor = colorParts[1]

                    return (
                      <div
                        key={staff.id}
                        className={`flex items-center justify-between rounded-md border p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                          selectedStaff.includes(staff.id)
                            ? 'border-primary/40 bg-primary/5 shadow-primary/5'
                            : 'border-border/40 hover:border-border/60'
                        }`}
                        onClick={() => handleStaffChange(staff.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              staff.isActive
                                ? 'bg-green-500 shadow-sm shadow-green-200 dark:shadow-green-900/20'
                                : 'bg-red-500 shadow-sm shadow-red-200 dark:shadow-red-900/20'
                            }`}
                            title={
                              staff.isActive
                                ? t('admin.staffCalendar.active')
                                : t('admin.staffCalendar.inactive')
                            }
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-sm ${bgColor} ${borderColor}`}
                            />
                            <span className="font-medium text-sm">
                              {staff.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-[10px] font-medium">
                            {staff.services.length}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {t('admin.staffCalendar.servicesCount', {
                              count: staff.services.length,
                            })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="h-[600px] md:col-span-3">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                  initialView={view}
                  headerToolbar={false}
                  allDaySlot={false}
                  locale={i18n.language === 'pt' ? ptLocale : undefined}
                  events={filteredBookings}
                  eventContent={renderEventContent}
                  eventClassNames={getEventClassNames}
                  nowIndicator={true}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  slotDuration="00:30:00"
                  height="100%"
                  businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '09:00',
                    endTime: '18:00',
                  }}
                  datesSet={(arg: DatesSetArg) => setDate(new Date(arg.start))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default StaffCalendarPage
