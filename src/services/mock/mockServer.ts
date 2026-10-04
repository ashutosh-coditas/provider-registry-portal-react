import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ENV } from '@/constants/env'
import { db } from './db'
import { mockRoutes } from './handlers'
import type { HttpMethod, MockRequest, MockResult } from './mock.types'
import { MockHttpError } from './mock.utils'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Matches `/providers/:id` against `/providers/42` → `{ id: '42' }`, or null. */
const matchPath = (pattern: string, path: string): Record<string, string> | null => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)
  if (patternParts.length !== pathParts.length) return null

  const params: Record<string, string> = {}
  for (const [index, part] of patternParts.entries()) {
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(pathParts[index])
    else if (part !== pathParts[index]) return null
  }
  return params
}

const parseBody = (data: unknown): unknown => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

const resolve = (request: Omit<MockRequest, 'params'>): MockResult => {
  for (const route of mockRoutes) {
    if (route.method !== request.method) continue
    const params = matchPath(route.path, request.path)
    if (params) return route.handler({ ...request, params })
  }
  return { status: 404, data: { message: `No mock handler for ${request.method} ${request.path}` } }
}

/**
 * Axios adapter that answers requests from localStorage instead of the network,
 * with an artificial delay so loading states are visible.
 */
export const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  db.init()
  await sleep(ENV.mockDelayMs)

  const url = new URL(config.url ?? '/', 'http://mock.local')
  const query: Record<string, string> = Object.fromEntries(url.searchParams)
  Object.entries(config.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) query[key] = String(value)
  })

  let result: MockResult
  try {
    result = resolve({
      method: (config.method ?? 'get').toUpperCase() as HttpMethod,
      path: url.pathname,
      query,
      body: parseBody(config.data),
      authorization: AxiosHeaders.from(config.headers).get('Authorization')?.toString() ?? null,
    })
  } catch (error) {
    result =
      error instanceof MockHttpError
        ? { status: error.status, data: { message: error.message } }
        : { status: 500, data: { message: 'Unexpected mock server error.' } }
  }

  const response: AxiosResponse = {
    data: result.data,
    status: result.status,
    statusText: String(result.status),
    headers: new AxiosHeaders(),
    config,
    request: {},
  }

  if (result.status >= 400) {
    const message = (result.data as { message?: string } | undefined)?.message ?? 'Request failed'
    const code = result.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST
    throw new AxiosError(message, code, config, null, response)
  }
  return response
}
