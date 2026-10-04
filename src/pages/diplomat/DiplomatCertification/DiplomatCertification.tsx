import { Navigate } from 'react-router'
import { CertificationForm } from '@/components/certification/CertificationForm'
import { CertificationStatusBadge } from '@/components/certification/CertificationStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import styles from './DiplomatCertification.module.scss'
import { useDiplomatCertificationState } from './DiplomatCertification.state'

export const DiplomatCertificationPage = () => {
  const {
    formKey,
    summary,
    isLoading,
    shouldRedirect,
    dashboardPath,
    title,
    eyebrow,
    switcherOptions,
    switchTo,
  } = useDiplomatCertificationState()

  if (shouldRedirect) return <Navigate to={dashboardPath} replace />

  return (
    <div className={styles.page}>
      {isLoading || !summary ? (
        <Skeleton width="40%" height={32} />
      ) : (
        <PageHeader
          back={{ to: dashboardPath, label: 'Dashboard' }}
          eyebrow={eyebrow}
          title={title}
          meta={<CertificationStatusBadge summary={summary} />}
          actions={
            <Select
              label="Switch certification"
              hideLabel
              options={switcherOptions}
              value={formKey}
              onChange={(event) => switchTo(event.target.value)}
              containerClassName={styles.switcher}
            />
          }
        />
      )}
      {/* Keyed so switching cycles starts a fresh form state. */}
      <CertificationForm key={formKey} formKey={formKey} exitTo={dashboardPath} />
    </div>
  )
}
