import type { RouteObject } from 'react-router'
import { RequireRole } from '@/components/guards/RequireRole'
import { AppShell } from '@/components/layouts/AppShell'
import { ROUTES } from '@/router/paths'

export const diplomatRoutes: RouteObject = {
  path: ROUTES.diplomat,
  element: <RequireRole roles={['diplomat']} />,
  children: [
    {
      element: <AppShell />,
      children: [
        {
          index: true,
          lazy: async () => ({
            Component: (await import('./DiplomatDashboard')).DiplomatDashboardPage,
          }),
        },
        {
          path: 'forms/:formKey',
          lazy: async () => ({
            Component: (await import('./DiplomatCertification')).DiplomatCertificationPage,
          }),
        },
      ],
    },
  ],
}
