import type { IconName } from '../Icon'

export interface TabItem<T extends string = string> {
  value: T
  label: string
  /** Small count/badge after the label. */
  count?: number
  icon?: IconName
  /** Colors the count as an alert (e.g. overdue). */
  alert?: boolean
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name of the tab list. */
  label: string
  /** id of the element the tabs control (the panel). */
  panelId?: string
  variant?: 'underline' | 'pills'
  className?: string
}
