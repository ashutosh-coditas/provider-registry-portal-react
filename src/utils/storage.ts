import type { StorageKey } from '@/constants/storageKeys'

const PREFIX = 'pp.'

/**
 * Safe JSON wrapper over localStorage. Every access is wrapped in try/catch because
 * storage can be disabled, full, or hold corrupted JSON.
 */
export const storage = {
  get<T>(key: StorageKey, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  },

  set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable: the app keeps working in memory for this request.
    }
  },

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      // Ignore: nothing to remove.
    }
  },

  /** Removes every `pp.` key, leaving other apps' data alone. */
  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => localStorage.removeItem(key))
    } catch {
      // Ignore: storage unavailable.
    }
  },
}
