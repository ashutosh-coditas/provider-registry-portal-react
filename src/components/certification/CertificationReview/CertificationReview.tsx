import { Accordion } from '@/components/ui/Accordion'
import { useCertificationReviewState } from './CertificationReview.state'
import type { CertificationReviewProps } from './CertificationReview.types'

/** Answers grouped by step: the step 4 review summary and the read-only view. */
export const CertificationReview = (props: CertificationReviewProps) => {
  const { items, defaultOpenIds } = useCertificationReviewState(props)
  return <Accordion items={items} defaultOpenIds={defaultOpenIds} />
}
