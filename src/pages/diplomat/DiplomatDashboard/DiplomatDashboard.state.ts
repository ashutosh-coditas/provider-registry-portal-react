import { useState } from 'react'
import type { TabItem } from '@/components/ui/Tabs'
import { useAuth } from '@/hooks/useAuth'
import { buildPath } from '@/router/paths'
import { useGetCertificationOverviewQuery } from '@/services/certification'
import { formatDisplayDate } from '@/utils/dates'

/** "all" or a form key. */
type CycleFilter = string

export const useDiplomatDashboardState = () => {
  const { user } = useAuth()
  const { data: overview, isLoading, isError, refetch } = useGetCertificationOverviewQuery()
  const [filter, setFilter] = useState<CycleFilter>('all')

  const items = overview?.items ?? []
  const current = items.find((item) => item.cycleNumber === overview?.currentCycle)
  const overdue = items.filter((item) => item.displayState === 'overdue')

  const tabs: TabItem[] = [
    { value: 'all', label: 'All' },
    ...items.map((item) => ({
      value: item.formKey,
      label: item.isInitial ? 'Cycle 1 · Initial' : item.title,
      icon: item.displayState === 'overdue' ? ('warning' as const) : undefined,
    })),
  ]

  return {
    name: user?.name ?? '',
    isLoading,
    isError,
    refetch,
    subtitle: overview
      ? `Diplomat since ${formatDisplayDate(overview.certifiedAt)}${
          current ? ` · Current: ${current.title} (${current.periodLabel})` : ''
        }`
      : '',
    current,
    overdue,
    firstOverdueTo: overdue[0] ? buildPath.diplomatForm(overdue[0].formKey) : null,
    tabs,
    filter,
    setFilter,
    visibleItems: filter === 'all' ? items : items.filter((item) => item.formKey === filter),
  }
}
