import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { StepperStep } from '@/components/ui/Stepper'
import { CERTIFICATION_STEPS } from '@/constants/certification'
import { useToast } from '@/hooks/useToast'
import { buildPath } from '@/router/paths'
import {
  certificationApi,
  useCompleteStepMutation,
  useGetCertificationQuery,
  useSaveDraftMutation,
  useSubmitCertificationMutation,
} from '@/services/certification'
import { useAppDispatch } from '@/store/hooks'
import type { StepNumber } from '@/types'
import { toApiError } from '@/utils/apiError'
import type { SchemaContext, StepValues } from '@/utils/certificationSchema'
import { parseDateKey } from '@/utils/dates'
import type { StepAction } from '../StepForm'
import type { CertificationFormProps } from './CertificationForm.types'

export const useCertificationFormState = ({ formKey, exitTo }: CertificationFormProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()

  const { data: detail, isLoading, isError, refetch } = useGetCertificationQuery(formKey)
  const [saveDraft, { isLoading: isAutoSaving }] = useSaveDraftMutation()
  const [completeStep] = useCompleteStepMutation()
  const [submitCertification, { isLoading: isSubmitting }] = useSubmitCertificationMutation()

  // The step on screen; until the user moves, it's the saved resume point.
  const [viewStep, setViewStep] = useState<StepNumber | null>(null)
  const [busyAction, setBusyAction] = useState<StepAction>(null)
  const [pendingSubmit, setPendingSubmit] = useState<StepValues | null>(null)
  // Real date captured once, used only until the form loads.
  const [fallbackToday] = useState(() => new Date())

  const form = detail?.form
  const step: StepNumber = viewStep ?? form?.currentStep ?? 1
  const completedSteps = form?.completedSteps ?? []

  // Steps can be reopened up to the first one that isn't saved yet.
  const firstOpenStep = ([1, 2, 3, 4] as const).find((item) => !completedSteps.includes(item)) ?? 4
  const goToStep = (target: StepNumber) => {
    if (target <= firstOpenStep) setViewStep(target)
  }

  const stepperSteps: StepperStep[] = CERTIFICATION_STEPS.map((config) => ({
    label: config.shortTitle,
    status:
      config.step === step
        ? 'current'
        : completedSteps.includes(config.step)
          ? 'complete'
          : 'upcoming',
  }))

  const schemaContext: SchemaContext = {
    today: (detail && parseDateKey(detail.today)) || fallbackToday,
    answers: form?.answers ?? {},
  }

  /** Runs an explicit action with a spinner and error toast. */
  const run = async (action: Exclude<StepAction, null>, task: () => Promise<void>) => {
    setBusyAction(action)
    try {
      await task()
    } catch (error) {
      toast.error(toApiError(error).message, { title: 'Couldn’t save' })
    } finally {
      setBusyAction(null)
    }
  }

  const draft = (values: StepValues, currentStep: StepNumber, invalidateStep?: StepNumber) =>
    saveDraft({ formKey, currentStep, answers: values, invalidateStep }).unwrap()

  const handleAutoSave = (values: StepValues, isValid: boolean) => {
    const invalidateStep = !isValid && completedSteps.includes(step) ? step : undefined
    draft(values, step, invalidateStep).catch(() =>
      toast.error('Your latest changes weren’t saved. Check your connection.', {
        title: 'Auto-save failed',
      }),
    )
  }

  const handleBack = (values: StepValues) =>
    run('back', async () => {
      const previous = (step - 1) as StepNumber
      await draft(values, previous)
      setViewStep(previous)
    })

  const handleExit = (values: StepValues) =>
    run('exit', async () => {
      await draft(values, step)
      toast.success('Progress saved. You can continue any time.')
      if (exitTo) navigate(exitTo)
    })

  const handleNext = (values: StepValues) =>
    run('next', async () => {
      await completeStep({ formKey, step, answers: values }).unwrap()
      toast.success(`Step ${step} saved.`)
      setViewStep((step + 1) as StepNumber)
    })

  const confirmSubmit = () =>
    run('submit', async () => {
      if (!pendingSubmit) return
      const response = await submitCertification({ formKey, answers: pendingSubmit }).unwrap()
      // Put the submitted form in the cache synchronously, before the success page mounts.
      dispatch(
        certificationApi.util.updateQueryData('getCertification', formKey, () => response.detail),
      )
      setPendingSubmit(null)
      // The success page refreshes the user (a candidate is now a diplomat). Doing it here
      // would re-render the candidate route first and its guard would redirect away.
      navigate(buildPath.certificationSuccess(formKey), { replace: true })
    })

  return {
    detail,
    isLoading,
    isError,
    refetch,
    step,
    completedSteps,
    stepperSteps,
    schemaContext,
    busyAction,
    isAutoSaving,
    isSubmitting,
    isSubmitOpen: pendingSubmit !== null,
    /** Cycle 1: submitting it makes the candidate a diplomat. */
    isInitial: Boolean(detail?.summary.isInitial),
    goToStep: (index: number) => goToStep((index + 1) as StepNumber),
    handleEditStep: goToStep,
    handleAutoSave,
    handleBack,
    handleExit,
    handleNext,
    handleRequestSubmit: (values: StepValues) => setPendingSubmit(values),
    closeSubmit: () => setPendingSubmit(null),
    confirmSubmit,
  }
}
