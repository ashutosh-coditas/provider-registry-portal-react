import { toDateKey, parseDateKey } from '@/utils/dates'
import { db } from '../mock/db'
import type { MockRoute } from '../mock/mock.types'
import { getNow, getRequestUser, MockHttpError, ok, requireRole } from '../mock/mock.utils'
import type { SettingsResponse, UpdateSettingsRequest } from './settings.types'

const respond = (): SettingsResponse => ({ ...db.settings.get(), today: toDateKey(getNow()) })

export const settingsMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/settings',
    handler: (request) => {
      getRequestUser(request)
      return ok(respond())
    },
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: (request) => {
      requireRole(request, ['admin'])
      const { simulatedDate } = request.body as UpdateSettingsRequest
      if (simulatedDate !== null && !parseDateKey(simulatedDate)) {
        throw new MockHttpError(400, 'Enter a valid date.')
      }
      db.settings.set({ simulatedDate })
      return ok(respond())
    },
  },
  {
    method: 'POST',
    path: '/admin/reset-demo',
    handler: (request) => {
      requireRole(request, ['admin'])
      db.reset()
      return ok(undefined, 204)
    },
  },
]
