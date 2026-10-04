import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { toastDismissed } from '@/store/slices/toast'
import type { ToastProps } from './Toast.types'

/** Auto-dismisses after `duration`; hovering or focusing pauses the timer. */
export const useToastState = ({ toast }: ToastProps) => {
  const dispatch = useAppDispatch()
  const [isPaused, setIsPaused] = useState(false)
  const dismiss = () => dispatch(toastDismissed(toast.id))

  useEffect(() => {
    if (!toast.duration || isPaused) return
    const timer = window.setTimeout(() => dispatch(toastDismissed(toast.id)), toast.duration)
    return () => window.clearTimeout(timer)
  }, [dispatch, toast.id, toast.duration, isPaused])

  return {
    dismiss,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  }
}
