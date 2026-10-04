import type { IconWeight } from '@phosphor-icons/react'
import type { ICONS } from './Icon.registry'

export type IconName = keyof typeof ICONS

export interface IconProps {
  name: IconName
  /** px; defaults to 20. Use 'em' sizing via `size="1em"` to follow font-size. */
  size?: number | string
  weight?: IconWeight
  className?: string
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string
}
