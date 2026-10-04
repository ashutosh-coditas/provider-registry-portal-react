/** localStorage keys. All are stored with the `pp.` prefix (see utils/storage). */
export const STORAGE_KEYS = {
  users: 'users',
  forms: 'forms',
  session: 'session',
  settings: 'settings',
  version: 'version',
  /** Per-browser UI preference; also read by the inline script in index.html. */
  theme: 'theme',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
