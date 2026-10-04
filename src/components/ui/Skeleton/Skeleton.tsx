import clsx from 'clsx'
import styles from './Skeleton.module.scss'
import type { SkeletonProps } from './Skeleton.types'

/** Loading placeholder. Decorative: announce loading elsewhere (e.g. aria-busy on the container). */
export const Skeleton = ({ width = '100%', height, shape = 'text', className }: SkeletonProps) => (
  <span
    className={clsx(styles.skeleton, styles[shape], className)}
    style={{ width, height }}
    aria-hidden="true"
  />
)
