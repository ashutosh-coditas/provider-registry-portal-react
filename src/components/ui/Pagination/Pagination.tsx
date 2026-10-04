import clsx from 'clsx'
import { IconButton } from '../IconButton'
import styles from './Pagination.module.scss'
import { usePaginationState } from './Pagination.state'
import type { PaginationProps } from './Pagination.types'

export const Pagination = (props: PaginationProps) => {
  const { page, pageSize, onPageChange, pageSizeOptions, onPageSizeChange, className } = props
  const { pageItems, rangeText, isFirst, isLast } = usePaginationState(props)

  return (
    <div className={clsx(styles.pagination, className)}>
      <p className={styles.range}>
        Showing <strong>{rangeText}</strong>
      </p>

      <div className={styles.controls}>
        {pageSizeOptions && onPageSizeChange && (
          <label className={styles.pageSize}>
            Rows
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        <nav className={styles.pages} aria-label="Pagination">
          <IconButton
            icon="chevronLeft"
            label="Previous page"
            size="sm"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
          />
          {pageItems.map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                className={clsx(styles.page, item === page && styles.current)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            ),
          )}
          <IconButton
            icon="chevronRight"
            label="Next page"
            size="sm"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
          />
        </nav>
      </div>
    </div>
  )
}
