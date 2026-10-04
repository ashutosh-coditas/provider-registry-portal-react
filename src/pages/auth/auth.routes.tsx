import type { RouteObject } from 'react-router'
import { GuestOnly } from '@/components/guards/GuestOnly'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { ROUTES } from '@/router/paths'

/** Public auth pages. Logged-in users are sent to their home page. */
export const authRoutes: RouteObject = {
  element: <GuestOnly />,
  children: [
    {
      element: <AuthLayout />,
      children: [
        {
          path: ROUTES.login,
          lazy: async () => ({ Component: (await import('./Login')).LoginPage }),
        },
        {
          path: ROUTES.register,
          lazy: async () => ({ Component: (await import('./Register')).RegisterPage }),
        },
      ],
    },
  ],
}
