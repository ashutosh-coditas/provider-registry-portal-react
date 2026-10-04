import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from 'react'
import type { ModalProps } from './Modal.types'

/**
 * Drives a native <dialog>: showModal() gives focus trapping, Escape, top-layer stacking and an
 * inert background for free. The dialog stays controlled by `open`.
 */
export const useModalState = ({ open, onClose, closeOnBackdrop = true }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Escape fires `cancel`; keep the state controlled instead of letting the browser close it.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  // A click whose target is the <dialog> itself landed on the backdrop.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) onClose()
  }

  return { dialogRef, titleId, descriptionId, handleCancel, handleClick }
}
