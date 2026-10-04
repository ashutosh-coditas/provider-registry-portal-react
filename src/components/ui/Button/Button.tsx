import { Icon } from '../Icon'
import { Spinner } from '../Spinner'
import { getButtonClassName, getButtonIconSize } from './Button.state'
import type { ButtonProps } from './Button.types'

export const Button = ({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const iconSize = getButtonIconSize(size)

  return (
    <button
      type={type}
      className={getButtonClassName({ variant, size, fullWidth }, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" label={null} />
      ) : (
        leftIcon && <Icon name={leftIcon} size={iconSize} />
      )}
      {children}
      {rightIcon && !isLoading && <Icon name={rightIcon} size={iconSize} />}
    </button>
  )
}
