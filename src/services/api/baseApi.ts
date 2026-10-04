import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

/**
 * Root RTK Query API. Each service module adds its endpoints with `baseApi.injectEndpoints`,
 * so modules stay independent while sharing one cache and one middleware.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Me', 'Providers', 'Certification', 'Certifications', 'Settings'],
  endpoints: () => ({}),
})

/** Everything that depends on the effective date or on certification progress. */
export const DATE_DEPENDENT_TAGS = [
  'Providers',
  'Certification',
  'Certifications',
  'Settings',
] as const
