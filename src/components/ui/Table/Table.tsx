import clsx from 'clsx'
import { Icon } from '../Icon'
import { Skeleton } from '../Skeleton'
import styles from './Table.module.scss'
import { useTableState } from './Table.state'
import type { TableProps } from './Table.types'

/** Data table with sortable headers, loading skeleton and empty state. Scrolls horizontally on small screens. */
export const Table = <T, K extends string = string>(props: TableProps<T, K>) => {
  const {
    columns,
    rows,
    getRowKey,
    caption,
    isLoading = false,
    loadingRows = 5,
    emptyState,
    className,
  } = props
  const { toggleSort, getAriaSort, getSortIcon } = useTableState(props)

  return (
    <div className={clsx(styles.wrapper, className)} aria-busy={isLoading || undefined}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={styles[column.align ?? 'left']}
                style={{ width: column.width }}
                aria-sort={column.sortable ? getAriaSort(column.key) : undefined}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.header}
                    <Icon name={getSortIcon(column.key)} size={14} className={styles.sortIcon} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: loadingRows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <Skeleton width={rowIndex % 2 ? '60%' : '80%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyState ?? 'No data'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td key={column.key} className={styles[column.align ?? 'left']}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
