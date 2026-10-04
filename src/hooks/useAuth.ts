import { useLogoutMutation } from '@/services/auth'
import { useAppSelector } from '@/store/hooks'
import { selectAuthStatus, selectAuthUser } from '@/store/slices/auth'

/** Current user and auth actions. Guards redirect automatically once the session ends. */
export const useAuth = () => {
  const user = useAppSelector(selectAuthUser)
  const status = useAppSelector(selectAuthStatus)
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation()

  // The session is cleared on success and on failure (see store/listeners.ts).
  const logout = () => logoutRequest()

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    logout,
    isLoggingOut,
  }
}
