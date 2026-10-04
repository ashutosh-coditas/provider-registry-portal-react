export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface MockRequest {
  method: HttpMethod
  path: string
  /** Values of `:param` segments in the route path. */
  params: Record<string, string>
  query: Record<string, string>
  body: unknown
  authorization: string | null
}

export interface MockResult {
  status: number
  data?: unknown
}

export interface MockRoute {
  method: HttpMethod
  /** Express-style path, e.g. `/providers/:id`. */
  path: string
  handler: (request: MockRequest) => MockResult
}
