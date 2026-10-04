import type { FormKey, FormStatus, PublicUser } from '@/types'

/**
 * - notStarted: the current form has no saved steps
 * - onTrack: in progress or submitted, nothing overdue
 * - overdue: at least one past cycle not submitted
 */
export type ProviderStatus = 'notStarted' | 'onTrack' | 'overdue'

/** Row in the admin providers grid. */
export interface ProviderListItem extends PublicUser {
  /** Cycle 1 (Initial Certification) for candidates, the current cycle for diplomats. */
  currentFormKey: FormKey
  currentFormStatus: FormStatus
  /** Saved steps of the current form, out of 4. */
  completion: number
  cycleNumber: number | null
  /** "Cycle 2 (2025–2028)", or "Cycle 1 · Initial" for candidates (no dates until submitted). */
  cycleLabel: string
  overdueCount: number
  status: ProviderStatus
}

export interface UpdateProviderRequest {
  id: string
  name: string
  username: string
  /** yyyy-MM-dd; diplomats only. Moves the provider's cycles. */
  certifiedAt?: string
}
