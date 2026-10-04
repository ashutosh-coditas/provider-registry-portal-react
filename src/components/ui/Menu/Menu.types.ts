import type { ReactNode } from 'react'
import type { IconName } from '../Icon'

export interface MenuItem {
  id: string
  label: string
  icon?: IconName
  onSelect: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
}

export interface MenuProps {
  /** Content of the trigger button (e.g. avatar + name). */
  trigger: ReactNode
  /** Accessible name of the trigger. */
  triggerLabel: string
  items: MenuItem[]
  /** Non-interactive content above the items (e.g. signed-in user). */
  header?: ReactNode
  align?: 'start' | 'end'
  triggerClassName?: string
  className?: string
}
