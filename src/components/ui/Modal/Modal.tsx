import clsx from 'clsx'
import { IconButton } from '../IconButton'
import styles from './Modal.module.scss'
import { useModalState } from './Modal.state'
import type { ModalProps } from './Modal.types'

export const Modal = (props: ModalProps) => {
  const { open, onClose, title, description, size = 'md', footer, children } = props
  const { dialogRef, titleId, descriptionId, handleCancel, handleClick } = useModalState(props)

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.dialog, styles[size])}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {/* Content mounts only while open, so forms inside start fresh each time. */}
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <IconButton icon="close" label="Close" size="sm" onClick={onClose} />
          </header>
          {children && <div className={styles.body}>{children}</div>}
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
