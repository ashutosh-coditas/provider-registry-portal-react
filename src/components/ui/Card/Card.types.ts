import type { ReactNode } from 'react'

export type CardTone = 'default' | 'success' | 'warning' | 'danger' | 'muted'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  as?: 'section' | 'article' | 'div'
  /** Heading shown in the card header. */
  title?: ReactNode
  description?: ReactNode
  /** Right side of the header (badges, buttons). */
  actions?: ReactNode
  footer?: ReactNode
  /** Border/background hint for state (e.g. danger for an overdue cycle). */
  tone?: CardTone
  padding?: CardPadding
  /** Dashed border, for locked/upcoming items. */
  dashed?: boolean
  className?: string
  children?: ReactNode
}
