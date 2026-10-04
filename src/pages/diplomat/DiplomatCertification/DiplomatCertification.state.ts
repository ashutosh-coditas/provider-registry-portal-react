import { useNavigate, useParams } from 'react-router'
import type { SelectOption } from '@/components/ui/Select'
import { getStatusBadge } from '@/components/certification/CertificationStatusBadge'
import { buildPath, ROUTES } from '@/router/paths'
import { useGetCertificationOverviewQuery } from '@/services/certification'
import type { FormKey } from '@/types'
import type { DiplomatCertificationParams } from './DiplomatCertification.types'

export const useDiplomatCertificationState = () => {
  const navigate = useNavigate()
  const { formKey = '' } = useParams<DiplomatCertificationParams>()
  const { data: overview, isLoading } = useGetCertificationOverviewQuery()

  const accessible = overview?.items.filter((item) => item.isAccessible) ?? []
  const summary = accessible.find((item) => item.formKey === formKey)

  const switcherOptions: SelectOption[] = accessible.map((item) => ({
    value: item.formKey,
    label: `${item.periodLabel ? `${item.title} (${item.periodLabel})` : item.title} · ${
      getStatusBadge(item).label
    }`,
  }))

  return {
    formKey: formKey as FormKey,
    summary,
    isLoading,
    /** Unknown, future or foreign form keys go back to the dashboard. */
    shouldRedirect: !isLoading && Boolean(overview) && !summary,
    dashboardPath: ROUTES.diplomat,
    title: summary?.isInitial ? 'Initial Certification' : `${summary?.title ?? ''} Recertification`,
    eyebrow: summary?.periodLabel ? `${summary.title} · ${summary.periodLabel}` : 'Certification',
    switcherOptions,
    switchTo: (target: string) => navigate(buildPath.diplomatForm(target as FormKey)),
  }
}
