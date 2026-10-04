import { useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { HOME_BY_ROLE } from '@/router/paths'
import type { RedirectLocationState } from '../RequireRole'

export const useGuestOnlyState = () => {
  const { user } = useAuth()
  const location = useLocation()
  const from = (location.state as RedirectLocationState | null)?.from

  // After login, return to the page the user originally asked for; RequireRole re-checks access.
  return { redirectTo: user ? (from ?? HOME_BY_ROLE[user.type]) : null }
}
