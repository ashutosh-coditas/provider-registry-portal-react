import type { ThemeMode } from '@/store/slices/ui'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Sets `data-theme` on <html>; `system` removes it so the OS preference applies. */
export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement
  if (mode === 'system') delete root.dataset.theme
  else root.dataset.theme = mode
}

export const prefersDark = () => window.matchMedia?.(DARK_QUERY).matches ?? false

/** The theme actually on screen. */
export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' =>
  mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode
