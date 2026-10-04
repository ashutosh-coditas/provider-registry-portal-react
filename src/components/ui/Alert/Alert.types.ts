import type { ReactNode } from 'react'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  tone?: AlertTone
  title?: ReactNode
  children?: ReactNode
  /** Button or link on the right (e.g. "Complete now"). */
  action?: ReactNode
  /** Shows a close button. */
  onDismiss?: () => void
  className?: string
}
