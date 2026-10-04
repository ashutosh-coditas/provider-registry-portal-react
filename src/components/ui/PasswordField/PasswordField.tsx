import { IconButton } from '../IconButton'
import { TextField } from '../TextField'
import { usePasswordFieldState } from './PasswordField.state'
import type { PasswordFieldProps } from './PasswordField.types'

export const PasswordField = (props: PasswordFieldProps) => {
  const { inputType, toggleIcon, toggleLabel, isVisible, toggle } = usePasswordFieldState()

  return (
    <TextField
      {...props}
      type={inputType}
      rightSlot={
        <IconButton
          icon={toggleIcon}
          label={toggleLabel}
          size="sm"
          onClick={toggle}
          aria-pressed={isVisible}
        />
      }
    />
  )
}
