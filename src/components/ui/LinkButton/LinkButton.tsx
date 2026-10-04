import { Link } from 'react-router'
import { getButtonClassName, getButtonIconSize } from '../Button'
import { Icon } from '../Icon'
import type { LinkButtonProps } from './LinkButton.types'

/** A router link that looks like a Button. Use for navigation; use Button for actions. */
export const LinkButton = ({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...rest
}: LinkButtonProps) => {
  const iconSize = getButtonIconSize(size)

  return (
    <Link className={getButtonClassName({ variant, size, fullWidth }, className)} {...rest}>
      {leftIcon && <Icon name={leftIcon} size={iconSize} />}
      {children}
      {rightIcon && <Icon name={rightIcon} size={iconSize} />}
    </Link>
  )
}
