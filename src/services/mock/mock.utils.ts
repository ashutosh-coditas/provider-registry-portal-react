import type { PublicUser, User, UserType } from '@/types'
import { parseDateKey } from '@/utils/dates'
import { db } from './db'
import type { MockRequest, MockResult } from './mock.types'

/** Throw inside a handler to answer with an HTTP error. */
export class MockHttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const ok = (data?: unknown, status = 200): MockResult => ({ status, data })

export const toPublicUser = ({ password: _password, ...user }: User): PublicUser => user

/**
 * Effective "now": the simulated date (Admin → Settings) with the real time of day, or the real now.
 * Every date rule in the mock API uses this.
 */
export const getNow = () => {
  const real = new Date()
  const { simulatedDate } = db.settings.get()
  const simulated = simulatedDate ? parseDateKey(simulatedDate) : null
  if (!simulated) return real
  simulated.setHours(real.getHours(), real.getMinutes(), real.getSeconds(), real.getMilliseconds())
  return simulated
}

export const nowIso = () => getNow().toISOString()

const TOKEN_PREFIX = 'mock-token.'

/** MOCK ONLY: a fake bearer token that just carries the user id. */
export const issueToken = (userId: string) => `${TOKEN_PREFIX}${userId}`

/** Resolves the logged-in user from the Authorization header, or throws 401. */
export const getRequestUser = (request: MockRequest): User => {
  const token = request.authorization?.replace(/^Bearer\s+/i, '') ?? ''
  const user = token.startsWith(TOKEN_PREFIX)
    ? db.users.findById(token.slice(TOKEN_PREFIX.length))
    : undefined
  if (!user) throw new MockHttpError(401, 'Your session has expired. Please log in again.')
  return user
}

/** Like getRequestUser, but also throws 403 when the user's type is not allowed. */
export const requireRole = (request: MockRequest, roles: UserType[]): User => {
  const user = getRequestUser(request)
  if (!roles.includes(user.type)) {
    throw new MockHttpError(403, 'You do not have access to this resource.')
  }
  return user
}
