import type { ReactNode } from 'react'

/** Props shared by every labelled form control. */
export interface FieldBaseProps {
  label: ReactNode
  /** Help text under the control. Hidden while an error is shown. */
  hint?: ReactNode
  error?: string
  /** Marks the field required (asterisk); validation itself stays in the zod schema. */
  required?: boolean
  /** Shows "(optional)" next to the label. */
  optional?: boolean
  /** Keeps the label for screen readers only (e.g. a search box). */
  hideLabel?: boolean
}

export interface FieldProps extends FieldBaseProps {
  /** id of the control the label points to. */
  htmlFor: string
  /** Right-aligned text under the control, e.g. a character counter. */
  aside?: ReactNode
  className?: string
  children: ReactNode
}
