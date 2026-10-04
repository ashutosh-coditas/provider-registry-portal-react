import type { ComponentPropsWithRef } from 'react'
import type { FieldBaseProps } from '../Field'

export interface TextareaProps extends FieldBaseProps, ComponentPropsWithRef<'textarea'> {
  /** Shows "n / maxLength" under the field. Requires `maxLength`. */
  showCount?: boolean
  containerClassName?: string
}
