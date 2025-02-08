import { z } from 'zod'

export const createServiceSchema = (
  t: (key: string, options?: any) => string
) =>
  z.object({
    name: z.string().min(1, t('validation.service.name')),
    description: z.string().min(1, t('validation.service.description')),
    price: z.string().min(1, t('validation.service.price')),
    image: z
      .any()
      .optional()
      .refine(
        files => !files || files.length === 0 || files[0] instanceof File,
        t('validation.service.image')
      ),
  })

export type ServiceFormData = z.infer<ReturnType<typeof createServiceSchema>>
