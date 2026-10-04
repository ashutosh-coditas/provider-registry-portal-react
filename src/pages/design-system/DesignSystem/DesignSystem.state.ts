import { useAuth } from '@/hooks/useAuth'
import { HOME_BY_ROLE, ROUTES } from '@/router/paths'

export const SECTIONS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'controls', label: 'Actions & forms' },
  { id: 'display', label: 'Display & feedback' },
  { id: 'navigation', label: 'Navigation & overlays' },
] as const

export const useDesignSystemState = () => {
  const { user } = useAuth()
  return {
    backTo: user ? HOME_BY_ROLE[user.type] : ROUTES.login,
    backLabel: user ? 'Back to app' : 'Back to login',
  }
}
