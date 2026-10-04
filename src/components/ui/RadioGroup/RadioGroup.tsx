import clsx from 'clsx'
import { getErrorId, getHintId, useFieldControl } from '../Field'
import styles from './RadioGroup.module.scss'
import type { RadioGroupProps } from './RadioGroup.types'

export const RadioGroup = ({
  label,
  options,
  hint,
  error,
  required,
  orientation = 'horizontal',
  selectedValue,
  containerClassName,
  className,
  id,
  ...inputProps
}: RadioGroupProps) => {
  const { controlId, controlProps } = useFieldControl({ id, hint, error })

  return (
    <fieldset
      className={clsx(styles.group, containerClassName)}
      aria-describedby={controlProps['aria-describedby']}
      aria-invalid={controlProps['aria-invalid']}
    >
      <legend className={styles.legend}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className={clsx(styles.options, styles[orientation])}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              className={clsx(styles.radio, className)}
              value={option.value}
              checked={selectedValue === undefined ? undefined : selectedValue === option.value}
              aria-invalid={controlProps['aria-invalid']}
              {...inputProps}
            />
            <span className={styles.text}>
              <span className={styles.label}>{option.label}</span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>

      {error ? (
        <p id={getErrorId(controlId)} className={styles.error}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={getHintId(controlId)} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </fieldset>
  )
}
