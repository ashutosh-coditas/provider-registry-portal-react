import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Badge.module.scss'
import type { BadgeProps } from './Badge.types'

/** Status pill: roles, form status (Completed / Due / Overdue), counts. */
export const Badge = ({
  tone = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
}: BadgeProps) => (
  <span className={clsx(styles.badge, styles[tone], styles[size], className)}>
    {dot && <span className={styles.dot} aria-hidden="true" />}
    {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} weight="bold" />}
    {children}
  </span>
)
