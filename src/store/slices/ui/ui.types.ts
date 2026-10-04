/** `system` follows the OS preference (no data-theme attribute). */
export type ThemeMode = 'light' | 'dark' | 'system'

export interface UiState {
  theme: ThemeMode
}
