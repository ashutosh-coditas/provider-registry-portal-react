import type { ComponentPropsWithRef } from 'react'
import type { IconName } from '../Icon'

export type IconButtonVariant = 'ghost' | 'secondary' | 'danger'
export type IconButtonSize = 'sm' | 'md'

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  icon: IconName
  /** Required accessible name (also shown as the native tooltip). */
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
}
