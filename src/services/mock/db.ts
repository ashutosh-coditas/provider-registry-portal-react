import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { FormsTable, Settings, User, UserForms } from '@/types'
import { storage } from '@/utils/storage'
import { buildSeed, SEED_VERSION } from './seed'

const DEFAULT_SETTINGS: Settings = { simulatedDate: null }

/**
 * The mock "database": typed collections over localStorage. Only mock handlers use it;
 * UI code always goes through RTK Query → axios → mock adapter.
 */
export const db = {
  /** Loads the seed on first run, or when the seed version changes. */
  init() {
    if (storage.get<number>(STORAGE_KEYS.version, 0) !== SEED_VERSION) db.reset()
  },

  /** Wipes all portal data (including the session) and reloads the seed. */
  reset() {
    storage.clearAll()
    const seed = buildSeed(new Date())
    storage.set(STORAGE_KEYS.users, seed.users)
    storage.set(STORAGE_KEYS.forms, seed.forms)
    storage.set(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
    storage.set(STORAGE_KEYS.version, SEED_VERSION)
  },

  users: {
    all: (): User[] => storage.get<User[]>(STORAGE_KEYS.users, []),
    saveAll: (users: User[]) => storage.set(STORAGE_KEYS.users, users),
    findById: (id: string) => db.users.all().find((user) => user.id === id),
    findByUsername: (username: string) =>
      db.users.all().find((user) => user.username === username.trim().toLowerCase()),
    insert(user: User) {
      db.users.saveAll([...db.users.all(), user])
      return user
    },
    update(id: string, patch: Partial<User>) {
      let updated: User | undefined
      db.users.saveAll(
        db.users.all().map((user) => {
          if (user.id !== id) return user
          updated = { ...user, ...patch, updatedAt: new Date().toISOString() }
          return updated
        }),
      )
      return updated
    },
    remove(id: string) {
      db.users.saveAll(db.users.all().filter((user) => user.id !== id))
      db.forms.removeForUser(id)
    },
  },

  forms: {
    all: (): FormsTable => storage.get<FormsTable>(STORAGE_KEYS.forms, {}),
    forUser: (userId: string): UserForms => db.forms.all()[userId] ?? {},
    saveForUser(userId: string, forms: UserForms) {
      storage.set(STORAGE_KEYS.forms, { ...db.forms.all(), [userId]: forms })
    },
    removeForUser(userId: string) {
      const { [userId]: _removed, ...rest } = db.forms.all()
      storage.set(STORAGE_KEYS.forms, rest)
    },
  },

  settings: {
    get: (): Settings => storage.get<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    set: (settings: Settings) => storage.set(STORAGE_KEYS.settings, settings),
  },
}
