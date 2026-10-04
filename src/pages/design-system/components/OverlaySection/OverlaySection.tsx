import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Menu } from '@/components/ui/Menu'
import { Modal } from '@/components/ui/Modal'
import { Stepper } from '@/components/ui/Stepper'
import { Tabs } from '@/components/ui/Tabs'
import { TextField } from '@/components/ui/TextField'
import { ShowcaseBlock, ShowcaseSection } from '../ShowcaseBlock'
import styles from './OverlaySection.module.scss'
import { CYCLE_TABS, useOverlaySectionState } from './OverlaySection.state'

export const OverlaySection = () => {
  const {
    toast,
    editModal,
    confirmDialog,
    isDeleting,
    confirmDelete,
    cycleTab,
    setCycleTab,
    steps,
    goToStep,
    nextStep,
    previousStep,
    menuItems,
  } = useOverlaySectionState()

  return (
    <ShowcaseSection
      id="navigation"
      title="Navigation & overlays"
      description="Keyboard-first: tabs use arrow keys, menus trap arrow navigation, dialogs use the native <dialog> focus trap."
    >
      <ShowcaseBlock
        title="Stepper"
        usage="Certification progress. Completed steps are clickable to go back."
      >
        <Stepper steps={steps} onStepClick={goToStep} label="Certification progress" />
        <div className={styles.row}>
          <Button variant="ghost" leftIcon="arrowLeft" onClick={previousStep}>
            Back
          </Button>
          <Button rightIcon="arrowRight" onClick={nextStep}>
            Save &amp; Next
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Tabs"
        usage="Underline for page sections; pills for compact switchers like the cycle filter."
      >
        <Tabs label="Cycle" items={CYCLE_TABS} value={cycleTab} onChange={setCycleTab} />
        <Tabs
          label="Cycle (pills)"
          items={CYCLE_TABS}
          value={cycleTab}
          onChange={setCycleTab}
          variant="pills"
        />
        <p className={styles.note}>Selected: {cycleTab}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Modal & confirm dialog"
        usage="Modal for edits, ConfirmDialog for destructive or final actions."
        inline
      >
        <Button variant="secondary" leftIcon="edit" onClick={editModal.open}>
          Edit provider
        </Button>
        <Button variant="danger" leftIcon="delete" onClick={confirmDialog.open}>
          Delete provider
        </Button>

        <Modal
          open={editModal.isOpen}
          onClose={editModal.close}
          title="Edit provider"
          description="Changes apply immediately."
          closeOnBackdrop={false}
          footer={
            <>
              <Button variant="secondary" onClick={editModal.close}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  editModal.close()
                  toast.success('Provider updated.')
                }}
              >
                Save changes
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            <TextField label="Name" defaultValue="Dr. Karan Rao" required />
            <TextField label="Username" defaultValue="dip.overdue" required />
            <TextField
              label="Certified on"
              type="date"
              defaultValue="2022-03-10"
              hint="Changing this moves the provider's cycles."
            />
          </div>
        </Modal>

        <ConfirmDialog
          open={confirmDialog.isOpen}
          onClose={confirmDialog.close}
          onConfirm={confirmDelete}
          tone="danger"
          title="Delete Dr. Karan Rao?"
          confirmLabel="Delete provider"
          isLoading={isDeleting}
        >
          This removes the provider and all their certification data.{' '}
          <strong>This cannot be undone.</strong>
        </ConfirmDialog>
      </ShowcaseBlock>

      <ShowcaseBlock title="Menu" usage="Account menu in the top bar." inline>
        <Menu
          triggerLabel="Account: Dr. Meera Iyer"
          trigger={
            <>
              <Avatar name="Dr. Meera Iyer" size="sm" />
              <span className={styles.menuName}>Dr. Meera Iyer</span>
            </>
          }
          align="start"
          items={menuItems}
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Toast"
        usage="Short confirmations after an action. Errors stay longer."
        inline
      >
        <Button variant="secondary" onClick={() => toast.success('Step 2 saved.')}>
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.error('Could not save. Check your connection and try again.', {
              title: 'Save failed',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.warning('Your passport expires in 5 months.')}
        >
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.info('Answers pre-filled from Cycle 1.')}>
          Info
        </Button>
      </ShowcaseBlock>
    </ShowcaseSection>
  )
}
