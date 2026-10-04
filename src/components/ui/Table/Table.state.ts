import type { SortState, TableProps } from './Table.types'

export const useTableState = <T, K extends string>({ sort, onSortChange }: TableProps<T, K>) => {
  /** Same column flips the direction; a new column starts ascending. */
  const toggleSort = (key: K) => {
    const next: SortState<K> =
      sort?.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    onSortChange?.(next)
  }

  const getAriaSort = (key: K) =>
    sort?.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'

  const getSortIcon = (key: K) =>
    sort?.key !== key ? 'sort' : sort.direction === 'asc' ? 'chevronUp' : 'chevronDown'

  return { toggleSort, getAriaSort, getSortIcon }
}
