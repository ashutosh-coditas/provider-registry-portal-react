import clsx from 'clsx'
import styles from './Button.module.scss'
import type { ButtonStyleProps } from './Button.types'

const ICON_SIZE = { sm: 16, md: 18, lg: 20 } as const

/** Class names for anything that should look like a button (also used by LinkButton). */
export const getButtonClassName = (
  { variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps,
  className?: string,
) => clsx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)

export const getButtonIconSize = (size: ButtonStyleProps['size'] = 'md') => ICON_SIZE[size]
