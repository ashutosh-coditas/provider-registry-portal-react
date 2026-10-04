import { useGetMeQuery } from '@/services/auth'
import { useAppSelector } from '@/store/hooks'
import { selectAuthStatus } from '@/store/slices/auth'

/** On app load, verifies a persisted token with GET /auth/me before any route renders. */
export const useAuthBootstrap = () => {
  const status = useAppSelector(selectAuthStatus)
  useGetMeQuery(undefined, { skip: status !== 'checking' })
  return { isChecking: status === 'checking' }
}
