import type { Answers, StepNumber } from '@/types'

export interface CertificationReviewProps {
  answers: Answers
  /** Steps to list (default: all four). */
  steps?: StepNumber[]
  /** Steps marked complete (shown as a badge). */
  completedSteps?: StepNumber[]
  /** Shows an Edit button per step. */
  onEditStep?: (step: StepNumber) => void
  /** Open every section (read-only view). */
  expandAll?: boolean
}
