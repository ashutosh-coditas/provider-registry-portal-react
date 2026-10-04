import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './IconButton.module.scss'
import type { IconButtonProps } from './IconButton.types'

export const IconButton = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) => (
  <button
    type={type}
    className={clsx(styles.iconButton, styles[variant], styles[size], className)}
    aria-label={label}
    title={label}
    {...rest}
  >
    <Icon name={icon} size={size === 'sm' ? 16 : 20} />
  </button>
)
