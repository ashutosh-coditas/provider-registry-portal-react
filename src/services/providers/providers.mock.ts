import { endOfDay, parseISO } from 'date-fns'
import { PROVIDER_ROLES } from '@/constants/roles'
import type { User } from '@/types'
import {
  buildCertificationSummaries,
  countOverdue,
  formatCycleLabel,
  getCurrentSummary,
} from '@/utils/cycles'
import { parseDateKey } from '@/utils/dates'
import { db } from '../mock/db'
import type { MockRoute } from '../mock/mock.types'
import { getNow, MockHttpError, ok, requireRole, toPublicUser } from '../mock/mock.utils'
import type { ProviderListItem, ProviderStatus, UpdateProviderRequest } from './providers.types'

const RESERVED_USERNAMES = ['admin']

export const toProviderListItem = (user: User, now = getNow()): ProviderListItem => {
  const summaries = buildCertificationSummaries(user, db.forms.forUser(user.id), now)
  const current = getCurrentSummary(summaries)
  const overdueCount = countOverdue(summaries)
  const status: ProviderStatus =
    overdueCount > 0
      ? 'overdue'
      : current.completion === 0 && current.status !== 'submitted'
        ? 'notStarted'
        : 'onTrack'

  return {
    ...toPublicUser(user),
    currentFormKey: current.formKey,
    currentFormStatus: current.status,
    completion: current.completion,
    cycleNumber: current.cycleNumber,
    cycleLabel: user.certifiedAt
      ? formatCycleLabel(current.cycleNumber, parseISO(user.certifiedAt))
      : 'Cycle 1 · Initial',
    overdueCount,
    status,
  }
}

const findProvider = (id: string) => {
  const user = db.users.findById(id)
  if (!user || !PROVIDER_ROLES.includes(user.type)) {
    throw new MockHttpError(404, 'This provider no longer exists.')
  }
  return user
}

export const providersMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/providers',
    handler: (request) => {
      requireRole(request, ['admin'])
      const now = getNow()
      const providers = db.users
        .all()
        .filter((user) => PROVIDER_ROLES.includes(user.type))
        .map((user) => toProviderListItem(user, now))
      return ok(providers)
    },
  },
  {
    method: 'PATCH',
    path: '/providers/:id',
    handler: (request) => {
      requireRole(request, ['admin'])
      const provider = findProvider(request.params.id)
      const { name, username, certifiedAt } = request.body as Omit<UpdateProviderRequest, 'id'>
      const normalizedUsername = username.trim().toLowerCase()

      const owner = db.users.findByUsername(normalizedUsername)
      if (RESERVED_USERNAMES.includes(normalizedUsername) || (owner && owner.id !== provider.id)) {
        throw new MockHttpError(409, 'Username already taken')
      }

      const patch: Partial<User> = { name: name.trim(), username: normalizedUsername }
      if (provider.type === 'diplomat' && certifiedAt) {
        const date = parseDateKey(certifiedAt)
        if (!date) throw new MockHttpError(400, 'Enter a valid certification date.')
        if (date > endOfDay(getNow())) {
          throw new MockHttpError(400, 'The certification date can’t be in the future.')
        }
        // Keep the original time of day so cycle boundaries stay stable.
        const previous = provider.certifiedAt ? parseISO(provider.certifiedAt) : getNow()
        date.setHours(previous.getHours(), previous.getMinutes(), previous.getSeconds())
        patch.certifiedAt = date.toISOString()
      }

      const updated = db.users.update(provider.id, patch)
      return ok(toProviderListItem(updated ?? provider))
    },
  },
  {
    method: 'DELETE',
    path: '/providers/:id',
    handler: (request) => {
      requireRole(request, ['admin'])
      db.users.remove(findProvider(request.params.id).id)
      return ok(undefined, 204)
    },
  },
  {
    method: 'POST',
    path: '/providers/:id/reset-progress',
    handler: (request) => {
      requireRole(request, ['admin'])
      const provider = findProvider(request.params.id)
      const { currentFormKey } = toProviderListItem(provider)
      if (provider.type === 'diplomat' && currentFormKey === 'cycle-1') {
        throw new MockHttpError(
          409,
          'Cycle 1 is the Initial Certification that made this provider a Diplomat. It can’t be reset.',
        )
      }
      const { [currentFormKey]: _removed, ...rest } = db.forms.forUser(provider.id)
      db.forms.saveForUser(provider.id, rest)
      return ok(toProviderListItem(provider))
    },
  },
]
