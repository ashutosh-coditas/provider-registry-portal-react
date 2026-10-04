import { useParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { buildPath, HOME_BY_ROLE, ROUTES } from '@/router/paths'
import { useGetMeQuery } from '@/services/auth'
import {
  useGetCertificationOverviewQuery,
  useGetCertificationQuery,
} from '@/services/certification'
import type { FormKey } from '@/types'
import { formatDisplayDate } from '@/utils/dates'
import type { CertificationSuccessParams } from './CertificationSuccess.types'

export const useCertificationSuccessState = () => {
  const { formKey = '' } = useParams<CertificationSuccessParams>()
  const { user } = useAuth()
  const { data: detail, isFetching, isError } = useGetCertificationQuery(formKey as FormKey)
  const { data: overview } = useGetCertificationOverviewQuery()
  // Refresh the session user: after Cycle 1 (Initial Certification) a candidate is a diplomat.
  // Done here (not in the form) so the candidate route is already gone when the role changes.
  useGetMeQuery(undefined, { refetchOnMountOrArgChange: true })

  const summary = detail?.summary
  const isInitial = Boolean(summary?.isInitial)
  const cycleOne = overview?.items.find((item) => item.cycleNumber === 1)
  const cycleTwo = overview?.items.find((item) => item.cycleNumber === 2)
  const isSubmitted = summary?.status === 'submitted'

  return {
    isLoading: isFetching && !isSubmitted,
    /** Not submitted (or not found) once fresh data is in: nothing to celebrate, go home. */
    shouldRedirect: !isFetching && (isError || !isSubmitted),
    homePath: user ? HOME_BY_ROLE[user.type] : ROUTES.login,
    answersPath: buildPath.diplomatForm(formKey as FormKey),
    isInitial,
    isLate: summary?.displayState === 'completedLate',
    title: isInitial ? 'Initial Certification submitted' : `${summary?.name ?? ''} submitted`,
    submittedOn: formatDisplayDate(summary?.submittedAt),
    cycleOneLabel: cycleOne?.periodLabel ? `Cycle 1 (${cycleOne.periodLabel})` : 'Cycle 1',
    nextCycleOpens: cycleTwo ? formatDisplayDate(cycleTwo.startsAt) : null,
  }
}
