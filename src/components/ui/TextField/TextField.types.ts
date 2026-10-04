import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { FieldBaseProps } from '../Field'
import type { IconName } from '../Icon'

/** Works with react-hook-form: `<TextField label="Name" {...register('name')} error={...} />`. */
export interface TextFieldProps
  extends FieldBaseProps, Omit<ComponentPropsWithRef<'input'>, 'size'> {
  leftIcon?: IconName
  /** Content inside the right edge of the input (e.g. a toggle button). */
  rightSlot?: ReactNode
  /** Class for the outer field wrapper. */
  containerClassName?: string
}
