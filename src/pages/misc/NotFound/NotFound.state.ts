import { useAuth } from '@/hooks/useAuth'
import { HOME_BY_ROLE, ROUTES } from '@/router/paths'

export const useNotFoundState = () => {
  const { user } = useAuth()
  return {
    homePath: user ? HOME_BY_ROLE[user.type] : ROUTES.login,
    homeLabel: user ? 'Go to Dashboard' : 'Go to Login',
  }
}
