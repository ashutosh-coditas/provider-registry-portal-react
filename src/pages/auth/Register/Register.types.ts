import { z } from 'zod'
import { nameField, passwordField, usernameField } from '@/utils/validators'

export const registerSchema = z.object({
  name: nameField,
  username: usernameField,
  password: passwordField,
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export interface PasswordCheck {
  label: string
  met: boolean
}
