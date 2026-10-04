import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { isAxiosError } from 'axios'
import type { ApiError, ApiRequest } from './api.types'
import { apiClient } from './client'

/** RTK Query base query that sends every request through the shared axios client. */
export const axiosBaseQuery =
  (): BaseQueryFn<ApiRequest, unknown, ApiError> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const response = await apiClient.request({ url, method, data, params })
      return { data: response.data }
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        return {
          error: {
            status: error.response?.status ?? 0,
            message: error.response?.data?.message ?? error.message,
          },
        }
      }
      return { error: { status: 0, message: 'Something went wrong. Please try again.' } }
    }
  }
