import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { TOTAL_STEPS } from '@/constants/certification'
import { CertificationReview } from '../CertificationReview'
import { QuestionField } from '../QuestionField'
import styles from './StepForm.module.scss'
import { useStepFormState } from './StepForm.state'
import type { StepFormProps } from './StepForm.types'

/** One step of the questionnaire. Mounted per step (keyed), so each step has its own form state. */
export const StepForm = (props: StepFormProps) => {
  const { step, answers, completedSteps, busyAction, onEditStep } = props
  const {
    config,
    isFirst,
    isLast,
    register,
    errors,
    showFollowUp,
    missingSteps,
    canSubmit,
    saveStatus,
    handleBack,
    handleExit,
    handlePrimary,
  } = useStepFormState(props)
  const isBusy = busyAction !== null

  return (
    <form className={styles.form} onSubmit={handlePrimary} noValidate>
      <header className={styles.header}>
        <span className={styles.icon}>
          <Icon name={config.icon} size={24} weight="duotone" />
        </span>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>
            Step {step} of {TOTAL_STEPS}
          </p>
          <h2 className={styles.title}>{config.title}</h2>
          <p className={styles.description}>{config.description}</p>
        </div>
        <p className={styles.saveStatus} aria-live="polite">
          <Icon name="save" size={14} />
          {saveStatus}
        </p>
      </header>

      <div className={styles.fields}>
        {config.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            register={register}
            errors={errors}
            showFollowUp={question.id === 'q19' && showFollowUp}
          />
        ))}
      </div>

      {isLast && (
        <section className={styles.review} aria-labelledby="review-title">
          <div>
            <h3 id="review-title" className={styles.reviewTitle}>
              Review your answers
            </h3>
            <p className={styles.description}>
              Check steps 1–3 before you submit. Submitted answers can’t be changed.
            </p>
          </div>
          {!canSubmit && (
            <Alert tone="warning" title={`Step ${missingSteps.join(', ')} isn’t saved yet`}>
              Open {missingSteps.length > 1 ? 'those steps' : 'that step'} and press Save &amp; Next
              before you submit.
            </Alert>
          )}
          <CertificationReview
            answers={answers}
            steps={[1, 2, 3]}
            completedSteps={completedSteps}
            onEditStep={onEditStep}
          />
        </section>
      )}

      <footer className={styles.footer}>
        {!isFirst && (
          <Button
            variant="ghost"
            leftIcon="arrowLeft"
            onClick={handleBack}
            isLoading={busyAction === 'back'}
            disabled={isBusy}
          >
            Back
          </Button>
        )}
        <div className={styles.footerEnd}>
          <Button
            variant="secondary"
            leftIcon="save"
            onClick={handleExit}
            isLoading={busyAction === 'exit'}
            disabled={isBusy}
          >
            Save &amp; Exit
          </Button>
          {isLast ? (
            <Button
              type="submit"
              variant="brand"
              leftIcon="seal"
              disabled={isBusy || !canSubmit}
              isLoading={busyAction === 'submit'}
            >
              Submit certification
            </Button>
          ) : (
            <Button
              type="submit"
              rightIcon="arrowRight"
              isLoading={busyAction === 'next'}
              disabled={isBusy}
            >
              Save &amp; Next
            </Button>
          )}
        </div>
      </footer>
    </form>
  )
}
