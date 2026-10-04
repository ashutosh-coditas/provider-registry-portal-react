import type { MockRoute } from '../mock/mock.types'
import { db } from '../mock/db'
import {
  getRequestUser,
  issueToken,
  MockHttpError,
  nowIso,
  ok,
  toPublicUser,
} from '../mock/mock.utils'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth.types'

const RESERVED_USERNAMES = ['admin']

export const authMockRoutes: MockRoute[] = [
  {
    method: 'POST',
    path: '/auth/login',
    handler: ({ body }) => {
      const { username, password } = body as LoginRequest
      const user = db.users.findByUsername(username ?? '')
      if (!user || user.password !== password) {
        throw new MockHttpError(401, 'Invalid username or password')
      }
      const response: LoginResponse = { token: issueToken(user.id), user: toPublicUser(user) }
      return ok(response)
    },
  },
  {
    method: 'POST',
    path: '/auth/register',
    handler: ({ body }) => {
      const { name, username, password } = body as RegisterRequest
      const normalizedUsername = username.trim().toLowerCase()
      if (
        RESERVED_USERNAMES.includes(normalizedUsername) ||
        db.users.findByUsername(normalizedUsername)
      ) {
        throw new MockHttpError(409, 'Username already taken')
      }
      const timestamp = nowIso()
      const user = db.users.insert({
        id: crypto.randomUUID(),
        name: name.trim(),
        username: normalizedUsername,
        password,
        type: 'candidate',
        certifiedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      const response: RegisterResponse = { user: toPublicUser(user) }
      return ok(response, 201)
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: (request) => ok(toPublicUser(getRequestUser(request))),
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: () => ok(undefined, 204),
  },
]
