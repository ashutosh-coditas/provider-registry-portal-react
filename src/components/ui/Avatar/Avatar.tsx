import clsx from 'clsx'
import styles from './Avatar.module.scss'
import { getInitials } from './Avatar.state'
import type { AvatarProps } from './Avatar.types'

/** Initials avatar. Decorative: the name is always shown or announced next to it. */
export const Avatar = ({ name, size = 'md', className }: AvatarProps) => (
  <span className={clsx(styles.avatar, styles[size], className)} aria-hidden="true">
    {getInitials(name)}
  </span>
)
