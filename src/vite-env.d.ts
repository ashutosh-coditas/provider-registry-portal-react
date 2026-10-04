interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_API: string
  readonly VITE_MOCK_DELAY_MS: string
  readonly VITE_SHOW_DEMO_TOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
