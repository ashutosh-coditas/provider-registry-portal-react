import axios from 'axios'
import { ENV } from '@/constants/env'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { Session } from '@/types'
import { storage } from '@/utils/storage'
import { mockAdapter } from '../mock/mockServer'

/**
 * Single axios instance for the app. With VITE_USE_MOCK_API on, requests are answered by
 * the localStorage mock adapter; turning it off sends the same requests to a real backend.
 */
export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  adapter: ENV.useMockApi ? mockAdapter : undefined,
})

apiClient.interceptors.request.use((config) => {
  const session = storage.get<Session | null>(STORAGE_KEYS.session, null)
  if (session?.token) {
    config.headers.set('Authorization', `Bearer ${session.token}`)
  }
  return config
})
