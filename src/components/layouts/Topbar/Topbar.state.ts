import type { BadgeTone } from '@/components/ui/Badge'
import type { MenuItem } from '@/components/ui/Menu'
import { ROLE_LABEL } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import type { UserType } from '@/types'

const ROLE_TONE: Record<UserType, BadgeTone> = {
  admin: 'neutral',
  candidate: 'warning',
  diplomat: 'success',
}

export const useTopbarState = () => {
  const { user, logout } = useAuth()

  const menuItems: MenuItem[] = [
    { id: 'logout', label: 'Log out', icon: 'logout', tone: 'danger', onSelect: logout },
  ]

  return {
    name: user?.name ?? '',
    username: user?.username ?? '',
    roleLabel: user ? ROLE_LABEL[user.type] : '',
    roleTone: user ? ROLE_TONE[user.type] : 'neutral',
    menuItems,
  }
}
