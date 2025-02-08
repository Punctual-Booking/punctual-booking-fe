import { z } from 'zod'

export const createServiceSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('admin.services.validation.nameRequired')),
    description: z
      .string()
      .min(1, t('admin.services.validation.descriptionRequired')),
    price: z.string().min(1, t('admin.services.validation.priceRequired')),
    duration: z
      .number()
      .min(15, t('admin.services.validation.durationRequired')),
    image: z.string().optional(),
  })

export type ServiceFormData = z.infer<ReturnType<typeof createServiceSchema>>
