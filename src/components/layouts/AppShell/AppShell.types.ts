import type { IconName } from '@/components/ui/Icon'

export type NavStatus = 'success' | 'warning' | 'danger' | 'neutral'

export interface NavItem {
  label: string
  to: string
  icon: IconName
  /** Match the path exactly (so `/admin` is not active on `/admin/settings`). */
  end?: boolean
  /** Status dot after the label (diplomat certifications). */
  status?: NavStatus
  /** Screen-reader text for the status dot. */
  statusLabel?: string
}

export interface NavGroup {
  id: string
  /** Section heading; omitted for the main group. */
  title?: string
  items: NavItem[]
}
