import type { PublicUser } from '@/types'

/**
 * - `checking`: a token was found on load and is being verified with GET /auth/me
 * - `authenticated`: user is known
 * - `anonymous`: no valid session
 */
export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

export interface AuthState {
  token: string | null
  user: PublicUser | null
  status: AuthStatus
}
