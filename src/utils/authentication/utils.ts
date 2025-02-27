import { z } from "zod"

export const createLoginSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.password.min', { min: 8 })),
  })

export const createRegisterSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    name: z.string().min(2, t('validation.name.min', { min: 2 })),
    email: z.string().email(t('validation.email')),
    password: z
      .string()
      .min(8, t('validation.password.min', { min: 8 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('validation.password.requirements')
      ),
  })

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>