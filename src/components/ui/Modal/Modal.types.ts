import type { ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Buttons row at the bottom. */
  footer?: ReactNode
  /** Clicking the dimmed backdrop closes the modal (default true). Disable for forms with edits. */
  closeOnBackdrop?: boolean
  children?: ReactNode
}
