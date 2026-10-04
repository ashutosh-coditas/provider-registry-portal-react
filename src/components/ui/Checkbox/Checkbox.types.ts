import type { ComponentPropsWithRef, ReactNode } from 'react'

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: ReactNode
  /** Secondary line under the label. */
  description?: ReactNode
  error?: string
  containerClassName?: string
}
