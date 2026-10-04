import clsx from 'clsx'
import { getErrorId, useFieldControl } from '../Field'
import { Icon } from '../Icon'
import styles from './Checkbox.module.scss'
import type { CheckboxProps } from './Checkbox.types'

export const Checkbox = ({
  label,
  description,
  error,
  containerClassName,
  className,
  id,
  ...inputProps
}: CheckboxProps) => {
  const { controlId, controlProps } = useFieldControl({ id, error })

  return (
    <div className={clsx(styles.container, containerClassName)}>
      <label htmlFor={controlId} className={styles.row}>
        <span className={styles.boxWrap}>
          <input
            type="checkbox"
            className={clsx(styles.input, className)}
            {...controlProps}
            {...inputProps}
          />
          <Icon name="check" size={14} weight="bold" className={styles.check} />
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
      </label>
      {error && (
        <p id={getErrorId(controlId)} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
