import { CertificationForm } from '@/components/certification/CertificationForm'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import styles from './CandidateDashboard.module.scss'
import { useCandidateDashboardState } from './CandidateDashboard.state'

export const CandidateDashboardPage = () => {
  const { formKey, completion } = useCandidateDashboardState()

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Candidate · Cycle 1"
        title="Initial Certification"
        meta={
          <Badge tone={completion > 0 ? 'primary' : 'neutral'}>{completion}/4 steps saved</Badge>
        }
        description="Cycle 1 is your Initial Certification. Complete all 4 steps to become a Diplomat: your 3-year Cycle 1 starts on the day you submit, and Cycle 2 follows. Answers save automatically, so you can leave and continue any time."
      />
      <CertificationForm formKey={formKey} />
    </div>
  )
}
