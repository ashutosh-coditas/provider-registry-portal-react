import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { getStepConfig, TOTAL_STEPS } from '@/constants/certification'
import { useAutoSave } from '@/hooks/useAutoSave'
import {
  getStepDefaults,
  getStepSchema,
  isStepValid,
  type StepValues,
} from '@/utils/certificationSchema'
import { formatDateTime } from '@/utils/dates'
import type { StepFormProps } from './StepForm.types'

export const useStepFormState = ({
  step,
  answers,
  completedSteps,
  schemaContext,
  isAutoSaving,
  lastSavedAt,
  onBack,
  onNext,
  onExit,
  onRequestSubmit,
  onAutoSave,
}: StepFormProps) => {
  const config = getStepConfig(step)
  const isLast = step === TOTAL_STEPS

  const form = useForm<StepValues>({
    resolver: zodResolver(getStepSchema(step, schemaContext)) as unknown as Resolver<StepValues>,
    defaultValues: getStepDefaults(step, answers),
    mode: 'onTouched',
  })

  const values = useWatch({ control: form.control }) as StepValues
  const { markSaved } = useAutoSave(values, (latest) =>
    onAutoSave(latest, isStepValid(step, latest, schemaContext)),
  )

  // Explicit saves record the values so the debounced auto-save doesn't repeat them.
  const withSaved = (handler: (values: StepValues) => void) => (submitted: StepValues) => {
    markSaved(form.getValues())
    handler(submitted)
  }

  const previousSteps = ([1, 2, 3] as const).filter((item) => item < step)
  const missingSteps = previousSteps.filter((item) => !completedSteps.includes(item))

  return {
    config,
    isFirst: step === 1,
    isLast,
    register: form.register,
    errors: form.formState.errors,
    showFollowUp: values.q19 === 'yes',
    missingSteps,
    canSubmit: missingSteps.length === 0,
    saveStatus: isAutoSaving
      ? 'Saving…'
      : lastSavedAt
        ? `Saved ${formatDateTime(lastSavedAt)}`
        : 'Not saved yet',
    handleBack: () => withSaved(onBack)(form.getValues()),
    handleExit: () => withSaved(onExit)(form.getValues()),
    handlePrimary: form.handleSubmit(withSaved(isLast ? onRequestSubmit : onNext)),
  }
}
