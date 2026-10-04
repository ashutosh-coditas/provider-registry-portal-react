import type { ComponentPropsWithRef, ReactNode } from 'react'

export interface RadioOption {
  value: string
  label: ReactNode
  description?: ReactNode
}

/**
 * Input props (name, onChange, onBlur, ref, disabled) are spread onto every radio, so
 * `{...register('field')}` from react-hook-form works directly.
 */
export interface RadioGroupProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'value' | 'defaultValue'
> {
  label: ReactNode
  options: RadioOption[]
  hint?: ReactNode
  error?: string
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
  /** Controlled selection (omit for uncontrolled / react-hook-form). */
  selectedValue?: string
  containerClassName?: string
}
