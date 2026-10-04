import { useState } from 'react'
import { useLocation } from 'react-router'
import { getStatusBadge } from '@/components/certification/CertificationStatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { buildPath, ROUTES } from '@/router/paths'
import { useGetCertificationOverviewQuery } from '@/services/certification'
import { useGetSettingsQuery } from '@/services/settings'
import type { CertificationDisplayState, CertificationSummary, UserType } from '@/types'
import { formatDisplayDate, parseDateKey } from '@/utils/dates'
import type { NavGroup, NavStatus } from './AppShell.types'

const MAIN_NAV: Record<UserType, NavGroup> = {
  admin: {
    id: 'main',
    items: [
      { label: 'Providers', to: ROUTES.admin, icon: 'users', end: true },
      { label: 'Settings', to: ROUTES.adminSettings, icon: 'settings' },
    ],
  },
  candidate: {
    id: 'main',
    items: [{ label: 'Cycle 1 · Initial', to: ROUTES.candidate, icon: 'certificate' }],
  },
  diplomat: {
    id: 'main',
    items: [{ label: 'Dashboard', to: ROUTES.diplomat, icon: 'dashboard', end: true }],
  },
}

const NAV_STATUS: Record<CertificationDisplayState, NavStatus> = {
  completed: 'success',
  completedLate: 'success',
  due: 'warning',
  overdue: 'danger',
  inProgress: 'warning',
  notStarted: 'neutral',
  upcoming: 'neutral',
}

const toCertificationGroup = (items: CertificationSummary[]): NavGroup => ({
  id: 'certifications',
  title: 'Certifications',
  items: items
    .filter((item) => item.isAccessible)
    .map((item) => ({
      label: item.isInitial ? 'Cycle 1 · Initial' : `${item.title} · ${item.periodLabel}`,
      to: buildPath.diplomatForm(item.formKey),
      icon: item.isInitial ? 'seal' : 'certificate',
      status: NAV_STATUS[item.displayState],
      statusLabel: getStatusBadge(item).label,
    })),
})

const DESKTOP_QUERY = '(min-width: 1024px)'

export const useAppShellState = () => {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [isCollapsed, setIsCollapsed] = useState(false)
  // The drawer remembers the path it was opened on, so navigating closes it without an effect.
  const [mobileOpenedAt, setMobileOpenedAt] = useState<string | null>(null)

  const isDiplomat = user?.type === 'diplomat'
  const { data: overview } = useGetCertificationOverviewQuery(undefined, { skip: !isDiplomat })
  const { data: settings } = useGetSettingsQuery()

  const navGroups: NavGroup[] = user ? [MAIN_NAV[user.type]] : []
  if (isDiplomat && overview) navGroups.push(toCertificationGroup(overview.items))

  return {
    navGroups,
    isDesktop,
    isCollapsed: isDesktop && isCollapsed,
    isMobileOpen: !isDesktop && mobileOpenedAt === pathname,
    toggleCollapsed: () => setIsCollapsed((value) => !value),
    openMobile: () => setMobileOpenedAt(pathname),
    closeMobile: () => setMobileOpenedAt(null),
    simulatedDate: settings?.simulatedDate
      ? formatDisplayDate(parseDateKey(settings.simulatedDate))
      : null,
    canChangeDate: user?.type === 'admin',
  }
}
