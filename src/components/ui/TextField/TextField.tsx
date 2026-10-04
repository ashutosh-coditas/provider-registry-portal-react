import clsx from 'clsx'
import { Field, useFieldControl } from '../Field'
import { Icon } from '../Icon'
import styles from './TextField.module.scss'
import type { TextFieldProps } from './TextField.types'

export const TextField = ({
  label,
  hint,
  error,
  required,
  optional,
  hideLabel,
  leftIcon,
  rightSlot,
  containerClassName,
  className,
  id,
  ...inputProps
}: TextFieldProps) => {
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
        {leftIcon && <Icon name={leftIcon} size={18} className={styles.leftIcon} />}
        <input
          className={clsx(
            styles.input,
            leftIcon && styles.hasLeftIcon,
            rightSlot && styles.hasRightSlot,
            className,
          )}
          required={required}
          {...controlProps}
          {...inputProps}
        />
        {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
      </div>
    </Field>
  )
}
