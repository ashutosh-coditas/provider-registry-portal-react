import type { UserType } from '@/types'

export const ROLE_LABEL: Record<UserType, string> = {
  admin: 'Admin',
  candidate: 'Candidate',
  diplomat: 'Diplomat',
}

export const PROVIDER_ROLES: UserType[] = ['candidate', 'diplomat']
