import clsx from 'clsx'
import type { ToastTone } from '@/store/slices/toast'
import { Icon, type IconName } from '../Icon'
import { IconButton } from '../IconButton'
import styles from './Toast.module.scss'
import { useToastState } from './Toast.state'
import type { ToastProps } from './Toast.types'

const TONE_ICON: Record<ToastTone, IconName> = {
  success: 'checkCircle',
  error: 'warningCircle',
  warning: 'warning',
  info: 'info',
}

export const Toast = ({ toast }: ToastProps) => {
  const { dismiss, pause, resume } = useToastState({ toast })

  return (
    <div
      className={clsx(styles.toast, styles[toast.tone])}
      role={toast.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <Icon name={TONE_ICON[toast.tone]} size={20} weight="fill" className={styles.icon} />
      <div className={styles.body}>
        {toast.title && <p className={styles.title}>{toast.title}</p>}
        <p className={styles.message}>{toast.message}</p>
      </div>
      <IconButton icon="close" label="Dismiss notification" size="sm" onClick={dismiss} />
    </div>
  )
}
