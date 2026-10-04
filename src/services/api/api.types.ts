import type { AxiosRequestConfig } from 'axios'

/** Argument every RTK Query endpoint passes to the axios base query. */
export interface ApiRequest {
  url: string
  method?: AxiosRequestConfig['method']
  data?: unknown
  params?: AxiosRequestConfig['params']
}

/** Normalised error shape returned by every endpoint (and thrown by `.unwrap()`). */
export interface ApiError {
  status: number
  message: string
}
