import { Button } from '../Button'
import { Modal } from '../Modal'
import styles from './ConfirmDialog.module.scss'
import type { ConfirmDialogProps } from './ConfirmDialog.types'

/** Confirmation for destructive or irreversible actions (delete, submit). */
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'primary',
  isLoading = false,
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    onClose={isLoading ? () => undefined : onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    {children && <div className={styles.message}>{children}</div>}
  </Modal>
)
