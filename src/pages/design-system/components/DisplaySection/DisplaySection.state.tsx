import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { SortState, TableColumn } from '@/components/ui/Table'
import styles from './DisplaySection.module.scss'
import type { SampleProvider, SampleSortKey } from './DisplaySection.types'

/** Example rows for the table demo (illustrative, not the seed data). */
const SAMPLE_PROVIDERS: SampleProvider[] = [
  {
    id: '1',
    name: 'Dr. Ananya Mehta',
    username: 'cand.new',
    type: 'candidate',
    completion: 0,
    cycle: null,
    overdue: 0,
  },
  {
    id: '2',
    name: 'Dr. Rohan Kulkarni',
    username: 'cand.partial',
    type: 'candidate',
    completion: 2,
    cycle: null,
    overdue: 0,
  },
  {
    id: '3',
    name: 'Dr. Meera Iyer',
    username: 'dip.ontrack',
    type: 'diplomat',
    completion: 2,
    cycle: 'Cycle 2 (2025–2028)',
    overdue: 0,
  },
  {
    id: '4',
    name: 'Dr. Karan Rao',
    username: 'dip.overdue',
    type: 'diplomat',
    completion: 0,
    cycle: 'Cycle 2 (2025–2028)',
    overdue: 1,
  },
  {
    id: '5',
    name: 'Dr. Priya Nair',
    username: 'dip.veteran',
    type: 'diplomat',
    completion: 1,
    cycle: 'Cycle 3 (2028–2031)',
    overdue: 0,
  },
  {
    id: '6',
    name: 'Dr. Vikram Shah',
    username: 'dip.fresh',
    type: 'diplomat',
    completion: 0,
    cycle: 'Cycle 1 (2026–2029)',
    overdue: 0,
  },
]

const PAGE_SIZE = 4

export const SAMPLE_COLUMNS: TableColumn<SampleProvider, SampleSortKey | 'cycle' | 'actions'>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (row) => (
      <span className={styles.nameCell}>
        <Avatar name={row.name} size="sm" />
        <span className={styles.nameText}>
          <strong>{row.name}</strong>
          <span>
            @{row.username} ·{' '}
            <Badge size="sm" tone={row.type === 'diplomat' ? 'success' : 'warning'}>
              {row.type === 'diplomat' ? 'Diplomat' : 'Candidate'}
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
    width: '180px',
    render: (row) => (
      <ProgressBar
        value={row.completion}
        max={4}
        showValue
        size="sm"
        label={`${row.name} completion`}
        tone={row.completion === 4 ? 'success' : 'primary'}
      />
    ),
  },
  {
    key: 'cycle',
    header: 'Cycle',
    render: (row) =>
      row.cycle ? (
        <span className={styles.cycleCell}>
          {row.cycle}
          {row.overdue > 0 && (
            <Badge tone="danger" size="sm" icon="warning">
              {row.overdue} overdue
            </Badge>
          )}
        </span>
      ) : (
        <span className={styles.muted}>—</span>
      ),
  },
  {
    key: 'actions',
    header: <span className="sr-only">Actions</span>,
    align: 'right',
    width: '96px',
    render: (row) => (
      <span className={styles.actions}>
        <IconButton icon="edit" label={`Edit ${row.name}`} size="sm" />
        <IconButton icon="delete" label={`Delete ${row.name}`} size="sm" variant="danger" />
      </span>
    ),
  },
]

export const useDisplaySectionState = () => {
  const [sort, setSort] = useState<SortState<SampleSortKey | 'cycle' | 'actions'>>({
    key: 'name',
    direction: 'asc',
  })
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const direction = sort.direction === 'asc' ? 1 : -1
  const sorted = [...SAMPLE_PROVIDERS].sort((a, b) =>
    sort.key === 'completion'
      ? (a.completion - b.completion) * direction
      : a.name.localeCompare(b.name) * direction,
  )

  const showLoading = () => {
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 1500)
  }

  return {
    rows: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    totalItems: SAMPLE_PROVIDERS.length,
    pageSize: PAGE_SIZE,
    page,
    setPage,
    sort,
    setSort,
    isLoading,
    showLoading,
  }
}
