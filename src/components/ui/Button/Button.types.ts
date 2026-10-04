import type { ComponentPropsWithRef } from 'react'
import type { IconName } from '../Icon'

/**
 * - primary: main action (one per view)
 * - brand: gradient, for the single most important moment (e.g. Submit certification)
 * - secondary: neutral bordered action
 * - outline: brand-colored bordered action
 * - ghost: low-emphasis action in toolbars
 * - danger / dangerOutline: destructive actions
 * - link: inline text action
 */
export type ButtonVariant =
  'primary' | 'brand' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dangerOutline' | 'link'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export interface ButtonProps extends ButtonStyleProps, ComponentPropsWithRef<'button'> {
  leftIcon?: IconName
  rightIcon?: IconName
  /** Shows a spinner, disables the button and sets aria-busy. */
  isLoading?: boolean
}
