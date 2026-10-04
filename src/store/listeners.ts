import { createListenerMiddleware } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { baseApi } from '@/services/api'
import { authApi } from '@/services/auth'
import type { Session } from '@/types'
import { storage } from '@/utils/storage'
import { applyTheme } from '@/utils/theme'
import { isSessionEnded } from './slices/auth'
import { themeChanged } from './slices/ui'

/** Side effects that react to actions (reducers stay pure). */
export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  matcher: authApi.endpoints.login.matchFulfilled,
  effect: ({ payload }) => {
    storage.set<Session>(STORAGE_KEYS.session, {
      token: payload.token,
      userId: payload.user.id,
      loggedInAt: new Date().toISOString(),
    })
  },
})

listenerMiddleware.startListening({
  predicate: (action) => isSessionEnded(action),
  effect: (_action, listenerApi) => {
    storage.remove(STORAGE_KEYS.session)
    // Drop cached data from the previous user.
    listenerApi.dispatch(baseApi.util.resetApiState())
  },
})

listenerMiddleware.startListening({
  actionCreator: themeChanged,
  effect: ({ payload }) => {
    storage.set(STORAGE_KEYS.theme, payload)
    applyTheme(payload)
  },
})
