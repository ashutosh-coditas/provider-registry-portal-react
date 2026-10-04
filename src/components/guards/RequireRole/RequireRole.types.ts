import type { UserType } from '@/types'

export interface RequireRoleProps {
  /** User types allowed to see the child routes. */
  roles: UserType[]
}

export interface RedirectLocationState {
  /** Path the user tried to open before logging in. */
  from?: string
}
