import { z } from 'zod'
import type { ProviderListItem } from '@/services/providers'
import { parseDateKey } from '@/utils/dates'
import { nameField, usernameField } from '@/utils/validators'

export interface EditProviderModalProps {
  provider: ProviderListItem
  onClose: () => void
}

/** certifiedAt is only edited (and required) for diplomats; it can't be after `today`. */
export const buildEditProviderSchema = (isDiplomat: boolean, today: Date) =>
  z.object({
    name: nameField,
    username: usernameField,
    certifiedAt: isDiplomat
      ? z
          .string()
          .min(1, 'Enter the certification date')
          .refine((value) => parseDateKey(value) !== null, 'Enter a valid date')
          .refine((value) => {
            const date = parseDateKey(value)
            return !date || date <= today
          }, 'The certification date can’t be in the future')
      : z.string(),
  })

export type EditProviderValues = z.infer<ReturnType<typeof buildEditProviderSchema>>
