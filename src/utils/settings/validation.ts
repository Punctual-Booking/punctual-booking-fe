import { z } from 'zod'

export const createSettingsSchema = (t: (key: string) => string) =>
  z.object({
    minNotice: z.number().min(1),
    slotDuration: z.number().min(15).max(60),
    businessName: z
      .string()
      .min(1, t('admin.settings.validation.nameRequired')),
    description: z.string().optional(),
    openingTime: z.string(),
    closingTime: z.string(),
  })

export type SettingsFormData = z.infer<ReturnType<typeof createSettingsSchema>>
