import type { RouteObject } from 'react-router'
import { RoleRedirect } from '@/components/guards/RoleRedirect'
import { ROUTES } from '@/router/paths'

export const miscRoutes: RouteObject[] = [
  { path: ROUTES.root, element: <RoleRedirect /> },
  {
    path: '*',
    lazy: async () => ({ Component: (await import('./NotFound')).NotFoundPage }),
  },
]
