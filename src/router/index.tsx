import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layouts/RootLayout'
import { adminRoutes } from '@/pages/admin/admin.routes'
import { authRoutes } from '@/pages/auth/auth.routes'
import { candidateRoutes } from '@/pages/candidate/candidate.routes'
import { certificationRoutes } from '@/pages/certification/certification.routes'
import { designSystemRoutes } from '@/pages/design-system/design-system.routes'
import { diplomatRoutes } from '@/pages/diplomat/diplomat.routes'
import { miscRoutes } from '@/pages/misc/misc.routes'

/**
 * Main router. Each page module owns its routes (guard, layout, lazy pages) in
 * `pages/<module>/<module>.routes.tsx`; this file only plugs them in.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      authRoutes,
      adminRoutes,
      candidateRoutes,
      diplomatRoutes,
      certificationRoutes,
      ...designSystemRoutes,
      ...miscRoutes,
    ],
  },
])
