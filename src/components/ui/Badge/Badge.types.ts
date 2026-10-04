import type { ReactNode } from 'react'
import type { IconName } from '../Icon'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  tone?: BadgeTone
  size?: BadgeSize
  /** Leading status dot. */
  dot?: boolean
  icon?: IconName
  className?: string
  children: ReactNode
}
