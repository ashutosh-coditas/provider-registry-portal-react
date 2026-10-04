import { baseApi, DATE_DEPENDENT_TAGS } from '../api/baseApi'
import type { SettingsResponse, UpdateSettingsRequest } from './settings.types'

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query<SettingsResponse, void>({
      query: () => ({ url: '/settings' }),
      providesTags: ['Settings'],
    }),
    updateSettings: build.mutation<SettingsResponse, UpdateSettingsRequest>({
      query: (body) => ({ url: '/settings', method: 'PUT', data: body }),
      invalidatesTags: [...DATE_DEPENDENT_TAGS],
    }),
    resetDemoData: build.mutation<void, void>({
      query: () => ({ url: '/admin/reset-demo', method: 'POST' }),
    }),
  }),
})

export const { useGetSettingsQuery, useUpdateSettingsMutation, useResetDemoDataMutation } =
  settingsApi
