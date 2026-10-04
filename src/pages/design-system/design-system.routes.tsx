import type { RouteObject } from 'react-router'
import { ENV } from '@/constants/env'
import { ROUTES } from '@/router/paths'

/** Public living style guide; only registered in demo builds (VITE_SHOW_DEMO_TOOLS). */
export const designSystemRoutes: RouteObject[] = ENV.showDemoTools
  ? [
      {
        path: ROUTES.designSystem,
        lazy: async () => ({ Component: (await import('./DesignSystem')).DesignSystemPage }),
      },
    ]
  : []
