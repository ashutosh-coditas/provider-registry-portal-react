import type { FormKey, UserType } from '@/types'

export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  admin: '/admin',
  adminSettings: '/admin/settings',
  candidate: '/candidate',
  diplomat: '/diplomat',
  diplomatForm: '/diplomat/forms/:formKey',
  certificationSuccess: '/certification/:formKey/success',
  designSystem: '/design-system',
} as const

/** Builders for routes that take params. */
export const buildPath = {
  diplomatForm: (formKey: FormKey) => `/diplomat/forms/${formKey}`,
  certificationSuccess: (formKey: FormKey) => `/certification/${formKey}/success`,
}

export const HOME_BY_ROLE: Record<UserType, string> = {
  admin: ROUTES.admin,
  candidate: ROUTES.candidate,
  diplomat: ROUTES.diplomat,
}
