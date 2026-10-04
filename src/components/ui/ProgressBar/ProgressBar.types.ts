export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger'

export interface ProgressBarProps {
  value: number
  max?: number
  /** Accessible name, e.g. "Initial Certification progress". */
  label: string
  /** Shows "value/max" next to the bar (e.g. 2/4). */
  showValue?: boolean
  tone?: ProgressTone
  size?: 'sm' | 'md'
  className?: string
}
