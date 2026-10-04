import clsx from 'clsx'
import styles from './DescriptionList.module.scss'
import type { DescriptionListProps } from './DescriptionList.types'

const isEmpty = (value: unknown) => value === null || value === undefined || value === ''

/** Label/value pairs: review summary, read-only answers, profile details. */
export const DescriptionList = ({ items, columns = 2, className }: DescriptionListProps) => (
  <dl className={clsx(styles.list, columns === 2 && styles.twoColumns, className)}>
    {items.map((item, index) => (
      <div key={index} className={clsx(styles.item, item.fullWidth && styles.fullWidth)}>
        <dt className={styles.label}>{item.label}</dt>
        <dd className={clsx(styles.value, isEmpty(item.value) && styles.empty)}>
          {isEmpty(item.value) ? '—' : item.value}
        </dd>
      </div>
    ))}
  </dl>
)
