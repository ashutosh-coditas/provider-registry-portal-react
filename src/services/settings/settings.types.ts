import type { Settings } from '@/types'

export interface SettingsResponse extends Settings {
  /** Effective today (yyyy-MM-dd). */
  today: string
}

export type UpdateSettingsRequest = Settings
