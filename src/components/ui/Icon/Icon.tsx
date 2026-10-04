import { ICONS } from './Icon.registry'
import type { IconProps } from './Icon.types'

/** Phosphor icon by name. Color follows `currentColor`, so it has no styles of its own. */
export const Icon = ({ name, size = 20, weight = 'regular', className, label }: IconProps) => {
  const Glyph = ICONS[name]
  return (
    <Glyph
      size={size}
      weight={weight}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  )
}
