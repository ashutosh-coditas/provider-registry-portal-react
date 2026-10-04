import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Field.module.scss'
import { getErrorId, getHintId } from './Field.state'
import type { FieldProps } from './Field.types'

/** Label + control + hint/error layout used by every form control. */
export const Field = ({
  htmlFor,
  label,
  hint,
  error,
  required,
  optional,
  hideLabel,
  aside,
  className,
  children,
}: FieldProps) => (
  <div className={clsx(styles.field, className)}>
    <label htmlFor={htmlFor} className={clsx(styles.label, hideLabel && 'sr-only')}>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
      {optional && <span className={styles.optional}>(optional)</span>}
    </label>

    {children}

    {(error || hint || aside) && (
      <div className={styles.meta}>
        {error ? (
          <p id={getErrorId(htmlFor)} className={styles.error}>
            <Icon name="warningCircle" size={14} weight="fill" />
            {error}
          </p>
        ) : (
          hint && (
            <p id={getHintId(htmlFor)} className={styles.hint}>
              {hint}
            </p>
          )
        )}
        {aside && <span className={styles.aside}>{aside}</span>}
      </div>
    )}
  </div>
)
