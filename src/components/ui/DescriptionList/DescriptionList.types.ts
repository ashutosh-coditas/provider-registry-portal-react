import type { ReactNode } from 'react'

export interface DescriptionItem {
  label: ReactNode
  /** Empty values render as an em dash. */
  value: ReactNode
  /** Span both columns (long text). */
  fullWidth?: boolean
}

export interface DescriptionListProps {
  items: DescriptionItem[]
  columns?: 1 | 2
  className?: string
}
