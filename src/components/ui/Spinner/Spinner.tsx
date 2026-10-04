import clsx from 'clsx'
import styles from './Spinner.module.scss'
import type { SpinnerProps } from './Spinner.types'

export const Spinner = ({ size = 'md', label = 'Loading', className }: SpinnerProps) => (
  <span
    className={clsx(styles.spinner, styles[size], className)}
    role={label ? 'status' : undefined}
  >
    {label && <span className="sr-only">{label}</span>}
  </span>
)
