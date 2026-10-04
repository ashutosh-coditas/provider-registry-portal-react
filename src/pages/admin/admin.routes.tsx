import type { RouteObject } from 'react-router'
import { RequireRole } from '@/components/guards/RequireRole'
import { AppShell } from '@/components/layouts/AppShell'
import { ROUTES } from '@/router/paths'

export const adminRoutes: RouteObject = {
  path: ROUTES.admin,
  element: <RequireRole roles={['admin']} />,
  children: [
    {
      element: <AppShell />,
      children: [
        {
          index: true,
          lazy: async () => ({ Component: (await import('./AdminDashboard')).AdminDashboardPage }),
        },
        {
          path: 'settings',
          lazy: async () => ({ Component: (await import('./AdminSettings')).AdminSettingsPage }),
        },
      ],
    },
  ],
}
