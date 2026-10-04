import type { Answers, StepNumber } from '@/types'
import type { SchemaContext, StepValues } from '@/utils/certificationSchema'

/** Which explicit action is running (drives button spinners). */
export type StepAction = 'back' | 'next' | 'exit' | 'submit' | null

export interface StepFormProps {
  step: StepNumber
  /** Saved answers of the whole form (defaults + review summary). */
  answers: Answers
  completedSteps: StepNumber[]
  schemaContext: SchemaContext
  busyAction: StepAction
  isAutoSaving: boolean
  lastSavedAt: string | null
  /** Back: saves a draft without validating. */
  onBack: (values: StepValues) => void
  /** Save & Next: called with validated values (steps 1–3). */
  onNext: (values: StepValues) => void
  /** Save & Exit: saves a draft without validating. */
  onExit: (values: StepValues) => void
  /** Step 4: validated values, opens the submit confirmation. */
  onRequestSubmit: (values: StepValues) => void
  /** Debounced draft save while typing. */
  onAutoSave: (values: StepValues, isValid: boolean) => void
  onEditStep: (step: StepNumber) => void
}
