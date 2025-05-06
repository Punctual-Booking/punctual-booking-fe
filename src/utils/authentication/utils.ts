import { z } from 'zod'

export const createLoginSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.password.min', { min: 8 })),
  })

export const createRegisterSchema = (
  t: (key: string, options?: any) => string
) => {
  const passwordSchema = z
    .string()
    .min(8, t('validation.password.min', { min: 8 }))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t('validation.password.requirements')
    )

  return z
    .object({
      firstName: z.string().min(2, t('validation.firstName.min', { min: 2 })),
      lastName: z.string().min(2, t('validation.lastName.min', { min: 2 })),
      email: z.string().email(t('validation.email')),
      password: passwordSchema,
      passwordConfirmation: passwordSchema,
    })
    .refine(data => data.password === data.passwordConfirmation, {
      message: t('validation.passwordConfirmation'),
      path: ['passwordConfirmation'],
    })
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>
