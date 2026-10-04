import type { CertificationSummary } from '@/types'

export interface CertificationStatusBadgeProps {
  summary: Pick<CertificationSummary, 'displayState' | 'endsAt' | 'completion'>
  size?: 'sm' | 'md'
}
