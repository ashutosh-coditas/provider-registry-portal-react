import type { LinkProps } from 'react-router'
import type { ButtonStyleProps } from '../Button'
import type { IconName } from '../Icon'

export interface LinkButtonProps extends ButtonStyleProps, LinkProps {
  leftIcon?: IconName
  rightIcon?: IconName
}
