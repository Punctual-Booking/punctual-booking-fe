import { z } from 'zod'

export const createStaffSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('admin.staff.validation.nameRequired')),
    email: z
      .string()
      .min(1, t('admin.staff.validation.emailRequired'))
      .email(t('admin.staff.validation.emailInvalid')),
    role: z.enum(['admin', 'staff']),
  })

export type StaffFormData = z.infer<ReturnType<typeof createStaffSchema>>
