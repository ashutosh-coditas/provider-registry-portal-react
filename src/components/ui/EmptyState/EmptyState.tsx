import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './EmptyState.module.scss'
import type { EmptyStateProps } from './EmptyState.types'

/** Centered icon + message for empty lists, not-found, and success screens. */
export const EmptyState = ({
  icon = 'inbox',
  title,
  description,
  action,
  size = 'inline',
  tone = 'primary',
  className,
  children,
}: EmptyStateProps) => {
  const TitleTag = size === 'page' ? 'h1' : 'h3'

  return (
    <div className={clsx(styles.empty, styles[size], className)}>
      <span className={clsx(styles.iconBadge, styles[tone])}>
        <Icon name={icon} size={size === 'page' ? 40 : 28} weight="duotone" />
      </span>
      <TitleTag className={styles.title}>{title}</TitleTag>
      {description && <p className={styles.description}>{description}</p>}
      {children}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
