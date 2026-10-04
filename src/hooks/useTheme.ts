import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectTheme, themeChanged, type ThemeMode } from '@/store/slices/ui'
import { resolveTheme } from '@/utils/theme'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const mode = useAppSelector(selectTheme)
  const resolved = resolveTheme(mode)

  return {
    mode,
    resolved,
    setTheme: (next: ThemeMode) => dispatch(themeChanged(next)),
    toggleTheme: () => dispatch(themeChanged(resolved === 'dark' ? 'light' : 'dark')),
  }
}
