import { useAppDispatch } from '@/store/hooks'
import { toastAdded, type ToastTone } from '@/store/slices/toast'

interface ToastOptions {
  title?: string
  /** ms before auto-dismiss; 0 = sticky. Errors default to 6s, others to 4s. */
  duration?: number
}

/** `const toast = useToast(); toast.success('Saved.')` */
export const useToast = () => {
  const dispatch = useAppDispatch()

  const show = (tone: ToastTone, message: string, options: ToastOptions = {}) =>
    dispatch(
      toastAdded({
        tone,
        message,
        title: options.title,
        duration: options.duration ?? (tone === 'error' ? 6000 : 4000),
      }),
    )

  return {
    success: (message: string, options?: ToastOptions) => show('success', message, options),
    error: (message: string, options?: ToastOptions) => show('error', message, options),
    warning: (message: string, options?: ToastOptions) => show('warning', message, options),
    info: (message: string, options?: ToastOptions) => show('info', message, options),
  }
}
