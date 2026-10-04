import type { ReactNode } from 'react'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Small label above the title (e.g. "Cycle 2 · 2025–2028"). */
  eyebrow?: ReactNode
  /** Badges next to the title. */
  meta?: ReactNode
  /** Buttons on the right. */
  actions?: ReactNode
  /** Back link above the header. */
  back?: { to: string; label: string }
  className?: string
}
