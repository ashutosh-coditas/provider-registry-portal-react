import type { PageItem, PaginationProps } from './Pagination.types'

/** 1 … 4 5 6 … 12: first, last, and the current page ±1. */
export const getPageItems = (page: number, pageCount: number): PageItem[] => {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  return [
    1,
    ...(start > 2 ? (['ellipsis-start'] as const) : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < pageCount - 1 ? (['ellipsis-end'] as const) : []),
    pageCount,
  ]
}

export const usePaginationState = ({ page, pageSize, totalItems }: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalItems)

  return {
    pageCount,
    pageItems: getPageItems(page, pageCount),
    rangeText: `${firstItem}–${lastItem} of ${totalItems}`,
    isFirst: page <= 1,
    isLast: page >= pageCount,
  }
}
