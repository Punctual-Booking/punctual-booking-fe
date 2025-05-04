import { useQuery } from '@tanstack/react-query'
import { getAppointmentById } from '@/services/appointmentService'
import {
  AppointmentResponseDto,
  Appointment,
  mapAppointmentFromDto,
} from '@/types/appointment'

// Extended Appointment type for the UI with additional properties
interface ExtendedAppointment extends Appointment {
  service: {
    id: string
    name: string
    price: number
    duration: number
    description?: string
  }
  staff: {
    id: string
    name: string
    specialties?: string[]
    phone?: string
    email?: string
  }
}

/**
 * Custom hook to fetch a single appointment by ID
 */
export const useAppointment = (id?: string) => {
  const {
    data: appointmentDto,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AppointmentResponseDto, Error>({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No appointment ID provided')
      }
      try {
        const result = await getAppointmentById(id)
        return result
      } catch (error) {
        throw error
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Map the DTO to the client model to ensure compatibility with existing components
  // We're adding extra properties to match what the BookingDetails component expects
  const appointment = appointmentDto
    ? ({
        ...mapAppointmentFromDto(appointmentDto),
        // Add the extra properties needed by the BookingDetails component
        service: {
          ...mapAppointmentFromDto(appointmentDto).service,
          description: appointmentDto.service.description,
        },
        staff: {
          ...mapAppointmentFromDto(appointmentDto).staff,
          specialties: appointmentDto.staff.specialties,
          phone: appointmentDto.staff.phone,
          email: appointmentDto.staff.email,
        },
      } as ExtendedAppointment)
    : undefined

  return {
    appointment,
    isLoading,
    isError,
    error,
    refetch,
  }
}
