import clsx from 'clsx'
import { Icon, type IconName } from '../Icon'
import { IconButton } from '../IconButton'
import styles from './Alert.module.scss'
import type { AlertProps, AlertTone } from './Alert.types'

const TONE_ICON: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'checkCircle',
  warning: 'warning',
  danger: 'warningCircle',
}

/** Inline message banner. Danger/warning are announced immediately (role=alert). */
export const Alert = ({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  className,
}: AlertProps) => (
  <div
    className={clsx(styles.alert, styles[tone], className)}
    role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
  >
    <Icon name={TONE_ICON[tone]} size={20} weight="fill" className={styles.icon} />
    <div className={styles.body}>
      {title && <p className={styles.title}>{title}</p>}
      {children && <div className={styles.text}>{children}</div>}
    </div>
    {action && <div className={styles.action}>{action}</div>}
    {onDismiss && (
      <IconButton
        icon="close"
        label="Dismiss"
        size="sm"
        onClick={onDismiss}
        className={styles.close}
      />
    )}
  </div>
)
