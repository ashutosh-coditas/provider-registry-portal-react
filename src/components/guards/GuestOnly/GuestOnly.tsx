import { Navigate, Outlet } from 'react-router'
import { useGuestOnlyState } from './GuestOnly.state'

/** Renders child routes (login, register) only when nobody is logged in. */
export const GuestOnly = () => {
  const { redirectTo } = useGuestOnlyState()
  if (redirectTo) return <Navigate to={redirectTo} replace />
  return <Outlet />
}
