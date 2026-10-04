import { Navigate, Outlet } from 'react-router'
import { useRequireRoleState } from './RequireRole.state'
import type { RequireRoleProps } from './RequireRole.types'

/** Renders child routes only for logged-in users of the given types. */
export const RequireRole = (props: RequireRoleProps) => {
  const { redirectTo, redirectState } = useRequireRoleState(props)
  if (redirectTo) return <Navigate to={redirectTo} state={redirectState} replace />
  return <Outlet />
}
