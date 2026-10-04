import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Stepper.module.scss'
import { useStepperState } from './Stepper.state'
import type { StepperProps } from './Stepper.types'

/** Horizontal step indicator. Completed steps can be clicked to go back. */
export const Stepper = (props: StepperProps) => {
  const { onStepClick, label = 'Progress', className } = props
  const { summary, items } = useStepperState(props)

  return (
    <nav className={clsx(styles.stepper, className)} aria-label={label}>
      <p className={styles.summary}>{summary}</p>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const content = (
            <>
              <span className={styles.circle}>
                {item.status === 'complete' ? (
                  <Icon name="check" size={16} weight="bold" />
                ) : item.status === 'error' ? (
                  <Icon name="warning" size={16} weight="bold" />
                ) : (
                  item.number
                )}
              </span>
              <span className={styles.text}>
                <span className={styles.label}>{item.label}</span>
                {item.description && <span className={styles.description}>{item.description}</span>}
                <span className="sr-only">, {item.statusText}</span>
              </span>
            </>
          )

          return (
            <li
              key={item.label}
              className={clsx(styles.item, styles[item.status])}
              aria-current={item.status === 'current' ? 'step' : undefined}
            >
              {item.isClickable ? (
                <button type="button" className={styles.step} onClick={() => onStepClick?.(index)}>
                  {content}
                </button>
              ) : (
                <div className={styles.step}>{content}</div>
              )}
              {!item.isLast && <span className={styles.connector} aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
