import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../index'
import type { ToastItem, ToastState } from './toast.types'

/** Oldest toasts are dropped beyond this many. */
const MAX_TOASTS = 4

const initialState: ToastState = { items: [] }

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    toastAdded: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.items = [...state.items, action.payload].slice(-MAX_TOASTS)
      },
      prepare: (toast: Omit<ToastItem, 'id'>) => ({ payload: { ...toast, id: nanoid() } }),
    },
    toastDismissed: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { toastAdded, toastDismissed } = toastSlice.actions
export const toastReducer = toastSlice.reducer

export const selectToasts = (state: RootState) => state.toast.items
