import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Accordion.module.scss'
import type { AccordionProps } from './Accordion.types'

/** Native <details>-based accordion: keyboard and screen-reader support for free. */
export const Accordion = ({ items, defaultOpenIds = [], className }: AccordionProps) => (
  <div className={clsx(styles.accordion, className)}>
    {items.map((item) => (
      <details key={item.id} className={styles.item} open={defaultOpenIds.includes(item.id)}>
        <summary className={styles.summary}>
          <span className={styles.title}>{item.title}</span>
          {item.meta && <span className={styles.meta}>{item.meta}</span>}
          <Icon name="chevronDown" size={18} className={styles.chevron} />
        </summary>
        <div className={styles.content}>{item.content}</div>
      </details>
    ))}
  </div>
)
