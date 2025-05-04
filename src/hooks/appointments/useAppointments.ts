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
import { useMemo } from 'react'

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

      // Look for cached data first
      const cachedData = queryClient.getQueryData<AppointmentResponseDto[]>([
        'appointments',
        userId,
      ])
      if (cachedData?.length) {
        console.log(
          'Using cached appointments data:',
          cachedData.length,
          'appointments'
        )
        return cachedData
      }

      try {
        console.log('Fetching appointments for user:', userId)
        const result = await getUserAppointments(userId)
        return result
      } catch (error) {
        throw error
      }
    },
    enabled: !!userId,
    retry: 1, // Reduce retries to avoid excessive requests
    staleTime: 15 * 60 * 1000, // 15 minutes - increase to reduce fetches
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: true, // Only fetch on mount
  })

  // Mutation to create a new appointment
  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData: Omit<CreateAppointmentData, 'businessId'>) =>
      createAppointment({
        ...appointmentData,
        businessId: BUSINESS_ID,
      }),
    onSuccess: newAppointment => {
      // Update cache directly instead of invalidating query
      const currentData =
        queryClient.getQueryData<AppointmentResponseDto[]>([
          'appointments',
          userId,
        ]) || []
      queryClient.setQueryData(
        ['appointments', userId],
        [...currentData, newAppointment]
      )
      toast.success(t('appointments.createSuccess'))
    },
    onError: (error: Error) => {
      console.error('Error creating appointment:', error)
      toast.error(`${t('appointments.createError')}: ${error.message}`)
    },
  })

  // Mutation to update an appointment
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentUpdateDto }) =>
      updateAppointment(id, data),
    onSuccess: (updatedAppointment, variables) => {
      // Update cache directly instead of invalidating query
      const currentData =
        queryClient.getQueryData<AppointmentResponseDto[]>([
          'appointments',
          userId,
        ]) || []
      const updatedData = currentData.map(appointment =>
        appointment.id === variables.id
          ? { ...appointment, ...updatedAppointment }
          : appointment
      )
      queryClient.setQueryData(['appointments', userId], updatedData)
      toast.success(t('appointments.updateSuccess'))
    },
    onError: (error: Error) => {
      console.error('Error updating appointment:', error)
      toast.error(`${t('appointments.updateError')}: ${error.message}`)
    },
  })

  // Get upcoming appointments - memoized
  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter(
          appointment => new Date(appointment.appointmentTime) > new Date()
        )
        .sort(
          (a, b) =>
            new Date(a.appointmentTime).getTime() -
            new Date(b.appointmentTime).getTime()
        ),
    [appointments]
  )

  // Get past appointments - memoized
  const pastAppointments = useMemo(
    () =>
      appointments
        .filter(
          appointment => new Date(appointment.appointmentTime) <= new Date()
        )
        .sort(
          (a, b) =>
            new Date(b.appointmentTime).getTime() -
            new Date(a.appointmentTime).getTime()
        ),
    [appointments]
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
