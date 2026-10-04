import { useNavigate } from 'react-router'
import type { MenuItem } from '@/components/ui/Menu'
import { DEMO_ACCOUNTS } from '@/constants/demo'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { HOME_BY_ROLE } from '@/router/paths'
import { baseApi } from '@/services/api'
import { useLoginMutation } from '@/services/auth'
import { useAppDispatch } from '@/store/hooks'
import { toApiError } from '@/utils/apiError'

/** Demo-only: log in as another seeded account without going through the login page. */
export const useDemoSwitcherState = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const [login] = useLoginMutation()

  const switchTo = async (username: string, password: string) => {
    try {
      // Drop the previous user's cached data before the new session starts.
      dispatch(baseApi.util.resetApiState())
      const { user: next } = await login({ username, password }).unwrap()
      navigate(HOME_BY_ROLE[next.type])
      toast.info(`Signed in as ${next.name}.`)
    } catch (error) {
      toast.error(toApiError(error).message, {
        title: 'Couldn’t switch user',
      })
    }
  }

  const items: MenuItem[] = DEMO_ACCOUNTS.filter(
    (account) => account.username !== user?.username,
  ).map((account) => ({
    id: account.username,
    label: `${account.username} · ${account.scenario}`,
    icon: account.username === 'admin' ? 'settings' : 'user',
    onSelect: () => void switchTo(account.username, account.password),
  }))

  return { items }
}
