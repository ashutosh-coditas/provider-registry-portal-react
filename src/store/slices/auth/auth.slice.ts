import { createSlice, isAnyOf, type UnknownAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { authApi } from '@/services/auth'
import { settingsApi } from '@/services/settings'
import type { Session } from '@/types'
import { storage } from '@/utils/storage'
import type { RootState } from '../../index'
import type { AuthState } from './auth.types'

const persistedSession = storage.get<Session | null>(STORAGE_KEYS.session, null)

const initialState: AuthState = {
  token: persistedSession?.token ?? null,
  user: null,
  status: persistedSession ? 'checking' : 'anonymous',
}

const anonymousState: AuthState = { token: null, user: null, status: 'anonymous' }

/** True when a real GET /auth/me attempt failed (not a skipped/deduped call). */
export const isSessionRejected = (action: UnknownAction): boolean =>
  authApi.endpoints.getMe.matchRejected(action) && !action.meta.condition

/**
 * Every action that ends the session: explicit clear, logout (success or failure), failed /me,
 * and a demo-data reset (which wipes all users).
 */
export const isSessionEnded = (action: UnknownAction): boolean =>
  isAnyOf(
    sessionCleared,
    authApi.endpoints.logout.matchFulfilled,
    authApi.endpoints.logout.matchRejected,
    settingsApi.endpoints.resetDemoData.matchFulfilled,
  )(action) || isSessionRejected(action)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionCleared: () => anonymousState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (_state, { payload }) => ({
        token: payload.token,
        user: payload.user,
        status: 'authenticated',
      }))
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload
        state.status = 'authenticated'
      })
      .addMatcher(isSessionEnded, () => anonymousState)
  },
})

export const { sessionCleared } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthToken = (state: RootState) => state.auth.token
