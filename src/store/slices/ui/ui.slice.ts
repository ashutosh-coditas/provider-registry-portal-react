import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { storage } from '@/utils/storage'
import type { RootState } from '../../index'
import type { ThemeMode, UiState } from './ui.types'

const initialState: UiState = {
  theme: storage.get<ThemeMode>(STORAGE_KEYS.theme, 'system'),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    themeChanged: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
    },
  },
})

export const { themeChanged } = uiSlice.actions
export const uiReducer = uiSlice.reducer

export const selectTheme = (state: RootState) => state.ui.theme
