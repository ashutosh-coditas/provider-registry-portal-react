import { authMockRoutes } from '../auth/auth.mock'
import { certificationMockRoutes } from '../certification/certification.mock'
import { providersMockRoutes } from '../providers/providers.mock'
import { settingsMockRoutes } from '../settings/settings.mock'
import type { MockRoute } from './mock.types'

/** Every module's mock routes. Add a module's `*.mock.ts` routes here. */
export const mockRoutes: MockRoute[] = [
  ...authMockRoutes,
  ...providersMockRoutes,
  ...certificationMockRoutes,
  ...settingsMockRoutes,
]
