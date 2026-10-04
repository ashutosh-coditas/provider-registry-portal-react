import { z } from 'zod'
import type { RedirectLocationState } from '@/components/guards/RequireRole'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Enter your username')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),
  password: z.string().min(1, 'Enter your password'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Router state Login accepts: from a guard redirect, or from Register after sign-up. */
export interface LoginLocationState extends RedirectLocationState {
  username?: string
}
