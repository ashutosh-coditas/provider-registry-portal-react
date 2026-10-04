import type { RouteObject } from 'react-router'
import { RequireRole } from '@/components/guards/RequireRole'
import { AppShell } from '@/components/layouts/AppShell'
import { ROUTES } from '@/router/paths'

export const candidateRoutes: RouteObject = {
  path: ROUTES.candidate,
  element: <RequireRole roles={['candidate']} />,
  children: [
    {
      element: <AppShell />,
      children: [
        {
          index: true,
          lazy: async () => ({
            Component: (await import('./CandidateDashboard')).CandidateDashboardPage,
          }),
        },
      ],
    },
  ],
}
