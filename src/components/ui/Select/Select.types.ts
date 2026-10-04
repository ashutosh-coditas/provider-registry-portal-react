import type { ComponentPropsWithRef } from 'react'
import type { FieldBaseProps } from '../Field'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/** Native <select> (accessible, mobile-friendly, works with long lists like countries). */
export interface SelectProps extends FieldBaseProps, Omit<ComponentPropsWithRef<'select'>, 'size'> {
  options: SelectOption[]
  /** Disabled first option shown while nothing is chosen. */
  placeholder?: string
  containerClassName?: string
}
