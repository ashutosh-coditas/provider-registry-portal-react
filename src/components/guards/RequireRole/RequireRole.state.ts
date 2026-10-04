import { useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { HOME_BY_ROLE, ROUTES } from '@/router/paths'
import type { RedirectLocationState, RequireRoleProps } from './RequireRole.types'

export const useRequireRoleState = ({ roles }: RequireRoleProps) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const state: RedirectLocationState = { from: location.pathname }
    return { redirectTo: ROUTES.login, redirectState: state }
  }
  if (!roles.includes(user.type)) {
    return { redirectTo: HOME_BY_ROLE[user.type], redirectState: undefined }
  }
  return { redirectTo: null, redirectState: undefined }
}
