export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error'

export interface StepperStep {
  label: string
  description?: string
  status: StepStatus
}

export interface StepperProps {
  steps: StepperStep[]
  /** Called with the step index when a complete/error step is clicked. Omit to make it display-only. */
  onStepClick?: (index: number) => void
  /** Accessible name, e.g. "Certification progress". */
  label?: string
  className?: string
}
