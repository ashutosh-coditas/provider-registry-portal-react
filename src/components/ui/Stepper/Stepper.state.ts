import type { StepperProps, StepStatus } from './Stepper.types'

const STATUS_TEXT: Record<StepStatus, string> = {
  complete: 'completed',
  current: 'current step',
  upcoming: 'not started',
  error: 'needs attention',
}

export const useStepperState = ({ steps, onStepClick }: StepperProps) => {
  const currentIndex = steps.findIndex((step) => step.status === 'current')

  return {
    summary: currentIndex >= 0 ? `Step ${currentIndex + 1} of ${steps.length}` : '',
    items: steps.map((step, index) => ({
      ...step,
      number: index + 1,
      statusText: STATUS_TEXT[step.status],
      isClickable: Boolean(onStepClick) && (step.status === 'complete' || step.status === 'error'),
      isLast: index === steps.length - 1,
    })),
  }
}
