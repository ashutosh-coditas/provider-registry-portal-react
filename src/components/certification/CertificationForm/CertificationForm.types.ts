import type { FormKey } from '@/types'

export interface CertificationFormProps {
  formKey: FormKey
  /** Where Save & Exit goes after saving. Omit to stay on the page (candidate dashboard). */
  exitTo?: string
}
