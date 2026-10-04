import type { ReactNode } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  /** Explains the consequence, e.g. "This cannot be undone." */
  children?: ReactNode
  /** Verb that names the action, e.g. "Delete provider". */
  confirmLabel: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  isLoading?: boolean
}
