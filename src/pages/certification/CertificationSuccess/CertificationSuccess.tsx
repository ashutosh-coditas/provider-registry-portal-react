import { Navigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LinkButton } from '@/components/ui/LinkButton'
import { Spinner } from '@/components/ui/Spinner'
import styles from './CertificationSuccess.module.scss'
import { useCertificationSuccessState } from './CertificationSuccess.state'

export const CertificationSuccessPage = () => {
  const {
    isLoading,
    shouldRedirect,
    homePath,
    answersPath,
    isInitial,
    isLate,
    title,
    submittedOn,
    cycleOneLabel,
    nextCycleOpens,
  } = useCertificationSuccessState()

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    )
  }
  if (shouldRedirect) return <Navigate to={homePath} replace />

  return (
    <div className={styles.center}>
      <Card padding="lg" className={styles.card}>
        <EmptyState
          size="page"
          icon="seal"
          tone="success"
          title={title}
          description={`Submitted on ${submittedOn}${isLate ? ' (after the cycle ended)' : ''}. Your answers are now locked.`}
          action={
            <>
              <LinkButton to={homePath} rightIcon="arrowRight">
                Go to Dashboard
              </LinkButton>
              <LinkButton to={answersPath} variant="secondary" leftIcon="file">
                View answers
              </LinkButton>
            </>
          }
        >
          {isInitial && (
            <div className={styles.promotion}>
              <span className={styles.promotionTitle}>You are now a Diplomat</span>
              <span>
                Your {cycleOneLabel} has begun today.
                {nextCycleOpens && (
                  <> Cycle 2 opens on {nextCycleOpens}: recertify once per cycle.</>
                )}
              </span>
            </div>
          )}
        </EmptyState>
      </Card>
    </div>
  )
}
