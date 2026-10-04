import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { SelectOption } from '@/components/ui/Select'
import type { SortState, TableColumn } from '@/components/ui/Table'
import { ROLE_LABEL } from '@/constants/roles'
import { useToast } from '@/hooks/useToast'
import {
  useDeleteProviderMutation,
  useGetProvidersQuery,
  type ProviderListItem,
} from '@/services/providers'
import { toApiError } from '@/utils/apiError'
import styles from './AdminDashboard.module.scss'
import type { ProviderSortKey, StatusFilter, TypeFilter } from './AdminDashboard.types'

export const TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All types' },
  { value: 'candidate', label: 'Candidates' },
  { value: 'diplomat', label: 'Diplomats' },
]

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'onTrack', label: 'On track' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'notStarted', label: 'Not started' },
]

export const PAGE_SIZE_OPTIONS = [10, 25, 50]

const matchesSearch = (provider: ProviderListItem, query: string) => {
  const needle = query.trim().toLowerCase()
  return (
    !needle || provider.name.toLowerCase().includes(needle) || provider.username.includes(needle)
  )
}

export const useAdminDashboardState = () => {
  const toast = useToast()
  const { data, isLoading, isError, refetch } = useGetProvidersQuery()
  const [deleteProvider, { isLoading: isDeleting }] = useDeleteProviderMutation()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortState<ProviderSortKey>>({ key: 'name', direction: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [editing, setEditing] = useState<ProviderListItem | null>(null)
  const [deleting, setDeleting] = useState<ProviderListItem | null>(null)

  const providers = data ?? []
  const direction = sort.direction === 'asc' ? 1 : -1
  const filtered = providers
    .filter(
      (provider) =>
        matchesSearch(provider, search) &&
        (typeFilter === 'all' || provider.type === typeFilter) &&
        (statusFilter === 'all' || provider.status === statusFilter),
    )
    .sort((a, b) =>
      sort.key === 'completion'
        ? (a.completion - b.completion || a.name.localeCompare(b.name)) * direction
        : a.name.localeCompare(b.name) * direction,
    )

  // Keep the page in range when filters shrink the list.
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const resetPage =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setPage(1)
    }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteProvider(deleting.id).unwrap()
      toast.success(`${deleting.name} was deleted.`)
      setDeleting(null)
    } catch (error) {
      toast.error(toApiError(error).message, { title: 'Couldn’t delete' })
    }
  }

  const columns: TableColumn<ProviderListItem, ProviderSortKey>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <span className={styles.nameCell}>
          <Avatar name={row.name} size="sm" />
          <span className={styles.nameText}>
            <span className={styles.name}>{row.name}</span>
            <span className={styles.meta}>
              @{row.username}
              <Badge tone={row.type === 'diplomat' ? 'success' : 'warning'} size="sm" dot>
                {ROLE_LABEL[row.type]}
              </Badge>
            </span>
          </span>
        </span>
      ),
    },
    {
      key: 'completion',
      header: 'Completion',
      sortable: true,
      width: '200px',
      render: (row) => (
        <ProgressBar
          label={`${row.name}: ${row.completion} of 4 steps`}
          value={row.completion}
          max={4}
          showValue
          size="sm"
          tone={row.currentFormStatus === 'submitted' ? 'success' : 'primary'}
        />
      ),
    },
    {
      key: 'cycle',
      header: 'Cycle',
      render: (row) => (
        <span className={styles.cycleCell}>
          <span className={row.type === 'candidate' ? styles.muted : undefined}>
            {row.cycleLabel}
          </span>
          {row.overdueCount > 0 && (
            <Badge tone="danger" size="sm" icon="warning">
              {row.overdueCount} overdue
            </Badge>
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      width: '104px',
      render: (row) => (
        <span className={styles.actions}>
          <IconButton icon="edit" label={`Edit ${row.name}`} onClick={() => setEditing(row)} />
          <IconButton
            icon="delete"
            label={`Delete ${row.name}`}
            variant="danger"
            onClick={() => setDeleting(row)}
          />
        </span>
      ),
    },
  ]

  const hasFilters = Boolean(search) || typeFilter !== 'all' || statusFilter !== 'all'

  return {
    isLoading,
    isError,
    refetch,
    stats: [
      { label: 'Providers', value: providers.length, tone: 'primary' as const },
      {
        label: 'Candidates',
        value: providers.filter((p) => p.type === 'candidate').length,
        tone: 'warning' as const,
      },
      {
        label: 'Diplomats',
        value: providers.filter((p) => p.type === 'diplomat').length,
        tone: 'success' as const,
      },
      {
        label: 'Overdue',
        value: providers.filter((p) => p.status === 'overdue').length,
        tone: 'danger' as const,
      },
    ],
    columns,
    rows,
    totalItems: filtered.length,
    search,
    setSearch: resetPage(setSearch),
    typeFilter,
    setTypeFilter: resetPage(setTypeFilter),
    statusFilter,
    setStatusFilter: resetPage(setStatusFilter),
    hasFilters,
    clearFilters: () => {
      setSearch('')
      setTypeFilter('all')
      setStatusFilter('all')
      setPage(1)
    },
    sort,
    setSort,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: resetPage(setPageSize),
    editing,
    closeEdit: () => setEditing(null),
    deleting,
    closeDelete: () => setDeleting(null),
    confirmDelete,
    isDeleting,
  }
}
