import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TextField } from '@/components/ui/TextField'
import styles from './EditProviderModal.module.scss'
import { useEditProviderModalState } from './EditProviderModal.state'
import type { EditProviderModalProps } from './EditProviderModal.types'

const FORM_ID = 'edit-provider-form'

export const EditProviderModal = (props: EditProviderModalProps) => {
  const { provider, onClose } = props
  const {
    register,
    errors,
    onSubmit,
    isSaving,
    isDiplomat,
    typeLabel,
    formLabel,
    completion,
    canReset,
    maxDate,
    isResetOpen,
    openReset,
    closeReset,
    confirmReset,
    isResetting,
  } = useEditProviderModalState(props)

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="Edit provider"
        description={`Changes to ${provider.name} apply immediately.`}
        closeOnBackdrop={false}
        footer={
          <>
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} isLoading={isSaving}>
              Save changes
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className={styles.form} onSubmit={onSubmit} noValidate>
          <TextField label="Name" required error={errors.name?.message} {...register('name')} />
          <TextField
            label="Username"
            required
            autoCapitalize="none"
            error={errors.username?.message}
            {...register('username')}
          />
          {isDiplomat && (
            <TextField
              label="Certified on"
              type="date"
              required
              max={maxDate}
              hint="Changing this moves the provider’s cycles."
              error={errors.certifiedAt?.message}
              {...register('certifiedAt')}
            />
          )}

          <div className={styles.readOnly}>
            <div className={styles.readOnlyRow}>
              <span className={styles.label}>Type</span>
              <Badge tone={isDiplomat ? 'success' : 'warning'} size="sm" dot>
                {typeLabel}
              </Badge>
            </div>
            <p className={styles.hint}>
              Type changes only when the provider submits Cycle 1, the Initial Certification.
            </p>
          </div>

          <div className={styles.readOnly}>
            <div className={styles.readOnlyRow}>
              <span className={styles.label}>Completion · {formLabel}</span>
            </div>
            <ProgressBar label="Current form completion" value={completion} max={4} showValue />
            <Button
              variant="dangerOutline"
              size="sm"
              leftIcon="clock"
              onClick={openReset}
              disabled={!canReset}
              className={styles.resetButton}
            >
              Reset current form progress
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={isResetOpen}
        onClose={closeReset}
        onConfirm={confirmReset}
        isLoading={isResetting}
        tone="danger"
        title="Reset progress?"
        confirmLabel="Reset to 0/4"
      >
        This clears every answer in {provider.name}’s <strong>{formLabel}</strong> form. Other
        certifications are not affected.
      </ConfirmDialog>
    </>
  )
}
