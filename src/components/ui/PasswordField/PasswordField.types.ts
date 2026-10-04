import type { TextFieldProps } from '../TextField'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'rightSlot'>
