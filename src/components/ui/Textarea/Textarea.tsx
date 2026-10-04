import clsx from 'clsx'
import { Field, useFieldControl } from '../Field'
import styles from './Textarea.module.scss'
import { useTextareaState } from './Textarea.state'
import type { TextareaProps } from './Textarea.types'

export const Textarea = (props: TextareaProps) => {
  const {
    label,
    hint,
    error,
    required,
    optional,
    hideLabel,
    showCount: _showCount,
    containerClassName,
    className,
    id,
    rows = 4,
    onChange: _onChange,
    ...textareaProps
  } = props
  const { controlId, controlProps } = useFieldControl({ id, hint, error })
  const { handleChange, counter } = useTextareaState(props)

  return (
    <Field
      htmlFor={controlId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      hideLabel={hideLabel}
      aside={counter}
      className={containerClassName}
    >
      <textarea
        className={clsx(styles.textarea, className)}
        rows={rows}
        required={required}
        onChange={handleChange}
        {...controlProps}
        {...textareaProps}
      />
    </Field>
  )
}
