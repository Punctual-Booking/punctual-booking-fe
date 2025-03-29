import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserAppointments,
  updateAppointment,
  createAppointment,
} from '@/services/appointmentService'
import {
  AppointmentResponseDto,
  AppointmentStatus,
  AppointmentCreateDto,
  AppointmentUpdateDto,
} from '@/types/appointment'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { BUSINESS_ID } from '@/config'

// Define the type for appointment creation data
interface CreateAppointmentData {
  staffId: string
  serviceId: string
  appointmentTime: string
  customerNotes?: string
  businessId: string
}

export const useAppointments = (userId?: string) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  console.log('useAppointments hook initialized with userId:', userId)

  // Query to fetch user appointments
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: async () => {
      if (!userId) {
        console.warn('No user ID provided to useAppointments hook')
        return []
      }

      console.log('Fetching appointments for user:', userId)
      try {
        const result = await getUserAppointments(userId)
        console.log('Fetched appointments:', result.length)
        return result
      } catch (error) {
        console.error('Error fetching appointments:', error)
        throw error
      }
    },
    enabled: !!userId,
    retry: 1, // Reduce retries to avoid excessive requests
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation to create a new appointment
  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData: Omit<CreateAppointmentData, 'businessId'>) =>
      createAppointment({
        ...appointmentData,
        businessId: BUSINESS_ID,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success(t('appointments.createSuccess'))
    },
    onError: (error: Error) => {
      console.error('Error creating appointment:', error)
      toast.error(`${t('appointments.createError')}: ${error.message}`)
    },
  })

  // Mutation to update an appointment
  const updateAppointmentMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { status: AppointmentStatus }
    }) => updateAppointment(id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success(t('appointments.updateSuccess'))
    },
    onError: (error: Error) => {
      console.error('Error updating appointment:', error)
      toast.error(`${t('appointments.updateError')}: ${error.message}`)
    },
  })

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(appointment => new Date(appointment.appointmentTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.appointmentTime).getTime() -
        new Date(b.appointmentTime).getTime()
    )

  // Get past appointments
  const pastAppointments = appointments
    .filter(appointment => new Date(appointment.appointmentTime) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.appointmentTime).getTime() -
        new Date(a.appointmentTime).getTime()
    )

  // Function to cancel an appointment
  const cancelAppointment = (id: string) => {
    updateAppointmentMutation.mutate({
      id,
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    })
  }

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    isLoading,
    isError,
    error,
    refetch,
    createAppointment: createAppointmentMutation.mutate,
    updateAppointment: updateAppointmentMutation.mutate,
    cancelAppointment,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
  }
}
