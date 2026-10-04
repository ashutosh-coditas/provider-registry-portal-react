import type { ApiError } from '@/services/api'

const FALLBACK_ERROR: ApiError = { status: 0, message: 'Something went wrong. Please try again.' }

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as ApiError).status === 'number' &&
  typeof (error as ApiError).message === 'string'

/** Normalises anything thrown by `.unwrap()` into an ApiError. */
export const toApiError = (error: unknown): ApiError => (isApiError(error) ? error : FALLBACK_ERROR)
