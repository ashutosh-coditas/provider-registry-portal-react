import { useAppSelector } from '@/store/hooks'
import { selectToasts } from '@/store/slices/toast'
import { Toast } from '../Toast'
import styles from './ToastViewport.module.scss'

/** Fixed stack of toasts. Mounted once in RootLayout; trigger toasts with useToast(). */
export const ToastViewport = () => {
  const toasts = useAppSelector(selectToasts)

  return (
    <section className={styles.viewport} aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </section>
  )
}
