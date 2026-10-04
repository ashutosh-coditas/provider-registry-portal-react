import clsx from 'clsx'
import styles from './ProgressBar.module.scss'
import type { ProgressBarProps } from './ProgressBar.types'

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = false,
  tone = 'primary',
  size = 'md',
  className,
}: ProgressBarProps) => {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className={clsx(styles.progress, className)}>
      <div
        className={clsx(styles.track, styles[size])}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max}`}
      >
        <span className={clsx(styles.fill, styles[tone])} style={{ width: `${percent}%` }} />
      </div>
      {showValue && (
        <span className={styles.value}>
          {value}/{max}
        </span>
      )}
    </div>
  )
}
