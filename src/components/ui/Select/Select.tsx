import clsx from 'clsx'
import { Field, useFieldControl } from '../Field'
import { Icon } from '../Icon'
import styles from './Select.module.scss'
import type { SelectProps } from './Select.types'

export const Select = ({
  label,
  hint,
  error,
  required,
  optional,
  hideLabel,
  options,
  placeholder,
  containerClassName,
  className,
  id,
  ...selectProps
}: SelectProps) => {
  const { controlId, controlProps } = useFieldControl({ id, hint, error })

  return (
    <Field
      htmlFor={controlId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <div className={styles.wrapper}>
        <select
          className={clsx(styles.select, className)}
          required={required}
          {...controlProps}
          {...selectProps}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={16} className={styles.chevron} />
      </div>
    </Field>
  )
}
