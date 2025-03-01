import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FullCalendarComponent } from '@/components/ui/full-calendar'
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
  },
  {
    id: '2',
    title: 'Styling - João Silva',
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    staffId: '1',
    resourceId: '1',
  },
  {
    id: '3',
    title: 'Manicure - Ana Costa',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    staffId: '2',
    resourceId: '2',
  },
  {
    id: '4',
    title: 'Facial - Pedro Oliveira',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    staffId: '2',
    resourceId: '2',
  },
  {
    id: '5',
    title: 'Massage - Sofia Martins',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    staffId: '3',
    resourceId: '3',
  },
]

// Define staff colors at the component level so they can be used in multiple places
const staffColors = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
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
      setFilteredBookings([])
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
    return new Intl.DateTimeFormat('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
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
                        className={`flex items-center justify-between rounded-md border p-2 ${
                          selectedStaff.includes(staff.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border'
                        }`}
                        onClick={() => handleStaffChange(staff.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              staff.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-sm ${bgColor} ${borderColor}`}
                            />
                            <span>{staff.name}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {staff.services.length}{' '}
                          {t('admin.staffCalendar.services')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="h-[600px] md:col-span-3">
                <FullCalendarComponent
                  ref={calendarRef}
                  events={filteredBookings}
                  view={view}
                  date={date}
                  headerToolbar={false}
                  allDaySlot={false}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  slotDuration="00:30:00"
                  height="100%"
                  locale={i18n.language === 'pt' ? ptLocale : undefined}
                  firstDay={1} // Start week on Monday
                  buttonText={{
                    today: t('calendar.today'),
                    month: t('calendar.month'),
                    week: t('calendar.week'),
                    day: t('calendar.day'),
                  }}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false,
                  }}
                  eventContent={(info: any) => {
                    // Extract the title which contains both service and customer name
                    const title = info.event.title
                    const titleParts = title.split(' - ')
                    const serviceName = titleParts[0]
                    const customerName = titleParts[1]

                    // Find staff member
                    const staffId = info.event.extendedProps.staffId
                    const staff = mockStaffMembers.find(s => s.id === staffId)

                    // Get color for this staff member
                    const colorClass = getStaffColor(staffId)

                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full w-full rounded border p-1 overflow-hidden group ${colorClass}`}
                          >
                            <div className="flex items-center gap-1">
                              <div className="font-medium truncate">
                                {customerName}
                              </div>
                              <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-xs truncate">
                              {serviceName}
                            </div>
                            <div className="text-xs truncate">
                              {staff?.name}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="start"
                          className="p-2 space-y-1"
                        >
                          <p className="font-medium">{customerName}</p>
                          <div className="mt-2">
                            <p className="text-xs font-medium">{serviceName}</p>
                            <p className="text-xs text-muted-foreground">
                              {staff?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
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
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }}
                  // Add custom styling for events
                  eventClassNames="rounded-md overflow-hidden border shadow-sm"
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
