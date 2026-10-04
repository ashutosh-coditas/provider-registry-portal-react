import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/ui/Stepper'
import { formatDisplayDate } from '@/utils/dates'
import { CertificationReview } from '../CertificationReview'
import { StepForm } from '../StepForm'
import styles from './CertificationForm.module.scss'
import { useCertificationFormState } from './CertificationForm.state'
import type { CertificationFormProps } from './CertificationForm.types'

const formLabel = (formKey: string) =>
  formKey === 'cycle-1'
    ? 'Cycle 1 (your Initial Certification)'
    : formKey.replace('cycle-', 'Cycle ')

/** The 4-step certification questionnaire for one cycle's form (Cycle 1 = Initial Certification). */
export const CertificationForm = (props: CertificationFormProps) => {
  const {
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
    isSubmitOpen,
    isInitial,
    goToStep,
    handleEditStep,
    handleAutoSave,
    handleBack,
    handleExit,
    handleNext,
    handleRequestSubmit,
    closeSubmit,
    confirmSubmit,
  } = useCertificationFormState(props)

  if (isLoading) {
    return (
      <Card padding="lg" className={styles.loading}>
        <Skeleton height={32} />
        <Skeleton width="40%" height={20} />
        <div className={styles.loadingGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} shape="rect" />
          ))}
        </div>
      </Card>
    )
  }

  if (isError || !detail) {
    return (
      <Card>
        <EmptyState
          icon="warningCircle"
          tone="danger"
          title="We couldn’t load this certification"
          description="It may not be available yet, or the page needs a refresh."
          action={
            <Button variant="secondary" onClick={refetch}>
              Try again
            </Button>
          }
        />
      </Card>
    )
  }

  const { summary, form, prefilledFrom } = detail

  if (summary.isReadOnly) {
    return (
      <div className={styles.stack}>
        <Alert tone="success" title={`Submitted on ${formatDisplayDate(form.submittedAt)}`}>
          {summary.displayState === 'completedLate'
            ? 'Submitted after the cycle ended. Answers are locked.'
            : 'Answers are locked and shown for reference.'}
        </Alert>
        <CertificationReview answers={form.answers} expandAll />
      </div>
    )
  }

  return (
    <div className={styles.stack}>
      {prefilledFrom && form.completedSteps.length === 0 && (
        <Alert tone="info" title={`Pre-filled from ${formLabel(prefilledFrom)}`}>
          Review each step and press Save &amp; Next. CME credits and the attestation must be given
          again for every cycle.
        </Alert>
      )}

      <Card padding="lg" className={styles.card}>
        <Stepper steps={stepperSteps} onStepClick={goToStep} label="Certification steps" />
        <StepForm
          key={`${detail.form.formKey}-${step}`}
          step={step}
          answers={form.answers}
          completedSteps={completedSteps}
          schemaContext={schemaContext}
          busyAction={busyAction}
          isAutoSaving={isAutoSaving}
          lastSavedAt={form.updatedAt}
          onBack={handleBack}
          onNext={handleNext}
          onExit={handleExit}
          onRequestSubmit={handleRequestSubmit}
          onAutoSave={handleAutoSave}
          onEditStep={handleEditStep}
        />
      </Card>

      <ConfirmDialog
        open={isSubmitOpen}
        onClose={closeSubmit}
        onConfirm={confirmSubmit}
        isLoading={busyAction === 'submit'}
        title={`Submit ${summary.name}?`}
        confirmLabel="Submit certification"
      >
        Your answers will be locked after submitting.
        {isInitial && (
          <>
            {' '}
            Submitting Cycle 1, your Initial Certification, makes you a <strong>Diplomat</strong>.
          </>
        )}
      </ConfirmDialog>
    </div>
  )
}
