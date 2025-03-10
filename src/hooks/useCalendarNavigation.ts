import { useState, useEffect, useRef, useCallback } from 'react'

interface CalendarNavigationOptions {
  mobileBreakpoint?: number
}

export function useCalendarNavigation(options: CalendarNavigationOptions = {}) {
  const { mobileBreakpoint = 768 } = options
  const [isMobileView, setIsMobileView] = useState(false)
  const calendarRef = useRef<any>(null)

  // Check for mobile view on component mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < mobileBreakpoint)
    }

    // Initial check
    checkMobileView()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView)
    }
  }, [mobileBreakpoint])

  // Determine initial view based on screen width
  const getInitialView = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < mobileBreakpoint
        ? 'timeGridDay'
        : 'timeGridWeek'
    }
    return 'timeGridWeek' // Default for SSR
  }, [mobileBreakpoint])

  // Get appropriate header toolbar based on screen size
  const getHeaderToolbar = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < mobileBreakpoint) {
      return {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridDay',
      }
    }
    return {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    }
  }, [mobileBreakpoint])

  // Function to navigate a week forward
  const navigateWeekForward = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const currentDate = calendarApi.getDate()
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 7)
      calendarApi.gotoDate(newDate)
    }
  }, [])

  // Function to navigate a week backward
  const navigateWeekBackward = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const currentDate = calendarApi.getDate()
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 7)
      calendarApi.gotoDate(newDate)
    }
  }, [])

  // Handle window resize for calendar
  const handleWindowResize = useCallback(
    (arg: any) => {
      const calendarApi = arg.view.calendar
      const isMobile = window.innerWidth < mobileBreakpoint

      if (isMobile) {
        calendarApi.changeView('timeGridDay')
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay',
        })
      } else {
        calendarApi.changeView('timeGridWeek')
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        })
      }
    },
    [mobileBreakpoint]
  )

  return {
    calendarRef,
    isMobileView,
    getInitialView,
    getHeaderToolbar,
    navigateWeekForward,
    navigateWeekBackward,
    handleWindowResize,
  }
}
