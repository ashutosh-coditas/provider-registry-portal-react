import clsx from 'clsx'
import { Link } from 'react-router'
import { Icon } from '../Icon'
import styles from './PageHeader.module.scss'
import type { PageHeaderProps } from './PageHeader.types'

/** The single h1 of a page, with optional eyebrow, badges, description and actions. */
export const PageHeader = ({
  title,
  description,
  eyebrow,
  meta,
  actions,
  back,
  className,
}: PageHeaderProps) => (
  <header className={clsx(styles.header, className)}>
    {back && (
      <Link to={back.to} className={styles.back}>
        <Icon name="arrowLeft" size={16} />
        {back.label}
      </Link>
    )}
    <div className={styles.row}>
      <div className={styles.heading}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {meta}
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  </header>
)
