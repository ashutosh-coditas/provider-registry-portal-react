export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  tone: ToastTone
  message: string
  title?: string
  /** Auto-dismiss delay in ms; 0 keeps the toast until closed. */
  duration: number
}

export interface ToastState {
  items: ToastItem[]
}
