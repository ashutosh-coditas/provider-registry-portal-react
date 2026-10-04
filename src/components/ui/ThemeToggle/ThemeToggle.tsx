import { useTheme } from '@/hooks/useTheme'
import { IconButton } from '../IconButton'

/** Switches between light and dark. Starts from the OS preference until the user picks one. */
export const ThemeToggle = () => {
  const { resolved, toggleTheme } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <IconButton
      icon={isDark ? 'sun' : 'moon'}
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    />
  )
}
