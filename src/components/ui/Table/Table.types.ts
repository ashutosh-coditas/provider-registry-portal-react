import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortState<K extends string = string> {
  key: K
  direction: SortDirection
}

export interface TableColumn<T, K extends string = string> {
  key: K
  header: ReactNode
  render: (row: T) => ReactNode
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  /** CSS width, e.g. '120px' or '30%'. */
  width?: string
}

export interface TableProps<T, K extends string = string> {
  columns: TableColumn<T, K>[]
  rows: T[]
  getRowKey: (row: T) => string
  /** Accessible table name (visually hidden). */
  caption: string
  sort?: SortState<K>
  onSortChange?: (sort: SortState<K>) => void
  isLoading?: boolean
  /** Skeleton rows while loading. */
  loadingRows?: number
  /** Shown when there are no rows (e.g. an EmptyState). */
  emptyState?: ReactNode
  className?: string
}
