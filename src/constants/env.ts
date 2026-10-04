export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
  mockDelayMs: Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 300),
  showDemoTools: import.meta.env.VITE_SHOW_DEMO_TOOLS === 'true',
} as const
