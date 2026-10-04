import type { ReactNode } from 'react'
import type { IconName } from '../Icon'

export interface EmptyStateProps {
  icon?: IconName
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  /** `page` for full-screen states (404, success), `inline` inside cards and tables. */
  size?: 'inline' | 'page'
  /** Icon badge tone. */
  tone?: 'primary' | 'success' | 'danger'
  className?: string
  children?: ReactNode
}
