import type { NavGroup } from '../AppShell'

export interface SidebarProps {
  navGroups: NavGroup[]
  isDesktop: boolean
  /** Desktop: icon-only rail. */
  isCollapsed: boolean
  /** Mobile: drawer visible. */
  isMobileOpen: boolean
  onToggleCollapsed: () => void
  onCloseMobile: () => void
}
