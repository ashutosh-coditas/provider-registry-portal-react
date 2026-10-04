import clsx from 'clsx'
import styles from './ShowcaseBlock.module.scss'
import type { ShowcaseBlockProps, ShowcaseSectionProps } from './ShowcaseBlock.types'

/** One component demo: title, usage note, live examples. */
export const ShowcaseBlock = ({ title, usage, inline = false, children }: ShowcaseBlockProps) => (
  <div className={styles.block}>
    <div className={styles.meta}>
      <h3 className={styles.title}>{title}</h3>
      {usage && <p className={styles.usage}>{usage}</p>}
    </div>
    <div className={clsx(styles.preview, inline && styles.inline)}>{children}</div>
  </div>
)

/** A group of blocks with an anchor id for the page navigation. */
export const ShowcaseSection = ({ id, title, description, children }: ShowcaseSectionProps) => (
  <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
    <header className={styles.sectionHeader}>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {title}
      </h2>
      <p className={styles.sectionDescription}>{description}</p>
    </header>
    {children}
  </section>
)
