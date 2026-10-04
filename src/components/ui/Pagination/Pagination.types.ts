export interface PaginationProps {
  /** 1-based current page. */
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  /** Shows a rows-per-page select when provided. */
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  className?: string
}

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'
