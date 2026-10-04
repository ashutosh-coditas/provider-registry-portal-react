import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { HOME_BY_ROLE, ROUTES } from '@/router/paths'

/** `/` → the user's home page, or login. */
export const RoleRedirect = () => {
  const { user } = useAuth()
  return <Navigate to={user ? HOME_BY_ROLE[user.type] : ROUTES.login} replace />
}
