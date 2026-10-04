import clsx from 'clsx'
import styles from './Card.module.scss'
import type { CardProps } from './Card.types'

export const Card = ({
  as: Element = 'section',
  title,
  description,
  actions,
  footer,
  tone = 'default',
  padding = 'md',
  dashed = false,
  className,
  children,
}: CardProps) => {
  const hasHeader = Boolean(title || description || actions)

  return (
    <Element
      className={clsx(
        styles.card,
        styles[tone],
        styles[padding],
        dashed && styles.dashed,
        className,
      )}
    >
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </Element>
  )
}
