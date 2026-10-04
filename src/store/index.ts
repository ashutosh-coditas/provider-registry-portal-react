import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '@/services/api'
import { listenerMiddleware } from './listeners'
import { authReducer } from './slices/auth'
import { toastReducer } from './slices/toast'
import { uiReducer } from './slices/ui'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    toast: toastReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
