import type { RouteObject } from 'react-router'
import { RequireRole } from '@/components/guards/RequireRole'
import { AppShell } from '@/components/layouts/AppShell'
import { ROUTES } from '@/router/paths'

/** Shared by both provider types: a candidate becomes a diplomat right before seeing this page. */
export const certificationRoutes: RouteObject = {
  element: <RequireRole roles={['candidate', 'diplomat']} />,
  children: [
    {
      element: <AppShell />,
      children: [
        {
          path: ROUTES.certificationSuccess,
          lazy: async () => ({
            Component: (await import('./CertificationSuccess')).CertificationSuccessPage,
          }),
        },
      ],
    },
  ],
}
