import clsx from 'clsx'
import styles from './Logo.module.scss'
import type { LogoProps } from './Logo.types'

export const Logo = ({ compact = false, tone = 'default', className }: LogoProps) => (
  <span className={clsx(styles.logo, styles[tone], className)}>
    <span className={styles.mark} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="currentColor" />
      </svg>
    </span>
    {compact ? (
      <span className="sr-only">Provider Portal</span>
    ) : (
      <span className={styles.wordmark}>
        Provider <span className={styles.accent}>Portal</span>
      </span>
    )}
  </span>
)
