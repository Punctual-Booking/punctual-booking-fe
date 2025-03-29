import { useState, useEffect } from 'react'
import { useAppointments } from '@/hooks/appointments/useAppointments'
import { User } from '@/types/auth'
import { queryClient } from '@/lib/queryClient'
import { mockLogin } from '@/mocks/mockAuthService'
import { Button } from '@/components/ui/button'
import { format, addDays, setHours, setMinutes } from 'date-fns'
import { createAppointment } from '@/services/appointmentService'
import { BUSINESS_ID } from '@/config'

export default function AppointmentTest() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logState, setLogState] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const addLog = (message: string) => {
    setLogState(prev => [
      ...prev,
      `${new Date().toISOString().slice(11, 19)} - ${message}`,
    ])
  }

  // Get the current user
  useEffect(() => {
    const cachedUser = queryClient.getQueryData<User>(['user'])
    addLog(
      `Initial user in cache: ${
        cachedUser ? JSON.stringify(cachedUser) : 'none'
      }`
    )
    setUser(cachedUser || null)
  }, [])

  // Force login
  const handleLogin = async () => {
    try {
      addLog('Attempting login...')
      const userData = await mockLogin('test@example.com', 'password')
      addLog(`Login success: ${JSON.stringify(userData)}`)
      queryClient.setQueryData(['user'], userData)
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      addLog(`Login error: ${errorMessage}`)
      setError(errorMessage)
    }
  }

  // Force logout
  const handleLogout = () => {
    addLog('Logging out')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    queryClient.setQueryData(['user'], null)
    setUser(null)
  }

  // Create test appointment
  const handleCreateAppointment = async () => {
    if (!user?.id) {
      addLog('Cannot create appointment: No user logged in')
      setError('Please log in first')
      return
    }

    try {
      setIsCreating(true)
      addLog('Creating test appointment...')

      // Calculate a future date (tomorrow at 10:00 AM)
      const appointmentDate = setMinutes(
        setHours(addDays(new Date(), 1), 10),
        0
      )

      // Create the appointment
      const newAppointment = await createAppointment({
        staffId: 'staff-1', // Using the first staff ID from mock data
        serviceId: 'service-1', // Using the first service ID from mock data
        appointmentTime: appointmentDate.toISOString(),
        customerNotes: 'Test appointment created from debug page',
        businessId: BUSINESS_ID,
      })

      addLog(`Appointment created: ${JSON.stringify(newAppointment)}`)

      // Force a refetch of appointments data
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      addLog(`Error creating appointment: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  // Check appointments for the user
  const {
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error: appointmentsError,
    refetch,
  } = useAppointments(user?.id)

  useEffect(() => {
    if (user?.id) {
      addLog(`Using appointments hook with user ID: ${user.id}`)
    }
  }, [user?.id])

  useEffect(() => {
    if (appointmentsError) {
      addLog(`Appointments error: ${appointmentsError.message}`)
      setError(appointmentsError.message)
    }
  }, [appointmentsError])

  useEffect(() => {
    addLog(
      `Got ${upcomingAppointments.length} upcoming and ${pastAppointments.length} past appointments`
    )
  }, [upcomingAppointments, pastAppointments])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Appointment Test Page</h1>

      <div className="p-4 border rounded bg-muted/20">
        <h2 className="text-lg font-semibold mb-2">User Status</h2>
        {user ? (
          <div>
            <p>
              Logged in as: {user.name} ({user.email})
            </p>
            <p>User ID: {user.id}</p>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="mt-2"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <Button onClick={handleLogin} className="mt-2">
              Force Login
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border rounded bg-muted/20">
        <h2 className="text-lg font-semibold mb-2">Appointments</h2>
        {isLoading ? (
          <p>Loading appointments...</p>
        ) : (
          <div>
            <div className="flex gap-4 mb-4">
              <Button onClick={() => refetch()} className="mb-4">
                Refresh Appointments
              </Button>
              <Button
                onClick={handleCreateAppointment}
                disabled={isCreating || !user}
                className="mb-4"
              >
                {isCreating ? 'Creating...' : 'Create Test Appointment'}
              </Button>
            </div>

            <h3 className="font-medium mb-2">
              Upcoming Appointments ({upcomingAppointments.length})
            </h3>
            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              <ul className="space-y-2">
                {upcomingAppointments.map(appointment => (
                  <li key={appointment.id} className="p-2 border rounded">
                    <p>
                      <strong>{appointment.service.name}</strong> with{' '}
                      {appointment.staff.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.appointmentTime), 'PPP p')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {appointment.id} | Customer ID:{' '}
                      {appointment.customerId}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="font-medium mb-2 mt-4">
              Past Appointments ({pastAppointments.length})
            </h3>
            {pastAppointments.length === 0 ? (
              <p>No past appointments</p>
            ) : (
              <ul className="space-y-2">
                {pastAppointments.map(appointment => (
                  <li key={appointment.id} className="p-2 border rounded">
                    <p>
                      <strong>{appointment.service.name}</strong> with{' '}
                      {appointment.staff.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.appointmentTime), 'PPP p')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {appointment.id} | Customer ID:{' '}
                      {appointment.customerId}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 border rounded bg-red-50 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="outline"
            className="mt-2"
          >
            Clear
          </Button>
        </div>
      )}

      <div className="p-4 border rounded bg-muted/20">
        <h2 className="text-lg font-semibold mb-2">Logs</h2>
        <div className="bg-black text-green-400 p-2 font-mono text-sm h-60 overflow-auto">
          {logState.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
        <Button
          onClick={() => setLogState([])}
          variant="outline"
          className="mt-2"
        >
          Clear Logs
        </Button>
      </div>
    </div>
  )
}
