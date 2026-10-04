import { baseApi } from '../api/baseApi'
import type { ProviderListItem, UpdateProviderRequest } from './providers.types'

export const providersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProviders: build.query<ProviderListItem[], void>({
      query: () => ({ url: '/providers' }),
      providesTags: ['Providers'],
    }),
    updateProvider: build.mutation<ProviderListItem, UpdateProviderRequest>({
      query: ({ id, ...body }) => ({ url: `/providers/${id}`, method: 'PATCH', data: body }),
      invalidatesTags: ['Providers'],
    }),
    deleteProvider: build.mutation<void, string>({
      query: (id) => ({ url: `/providers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Providers'],
    }),
    resetProviderProgress: build.mutation<ProviderListItem, string>({
      query: (id) => ({ url: `/providers/${id}/reset-progress`, method: 'POST' }),
      invalidatesTags: ['Providers'],
    }),
  }),
})

export const {
  useGetProvidersQuery,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useResetProviderProgressMutation,
} = providersApi
