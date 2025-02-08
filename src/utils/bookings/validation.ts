import { z } from 'zod'

export const createBookingSchema = (t: (key: string) => string) =>
  z.object({
    customerId: z
      .string()
      .min(1, t('admin.bookings.validation.customerRequired')),
    serviceId: z
      .string()
      .min(1, t('admin.bookings.validation.serviceRequired')),
    staffId: z.string().min(1, t('admin.bookings.validation.staffRequired')),
    startTime: z.string(),
    endTime: z.string(),
    notes: z.string().optional(),
  })

export type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>
