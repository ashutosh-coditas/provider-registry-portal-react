import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import styles from './AdminSettings.module.scss'
import { useAdminSettingsState } from './AdminSettings.state'

export const AdminSettingsPage = () => {
  const {
    isLoading,
    value,
    setValue,
    dateError,
    isDirty,
    isSimulated,
    effectiveToday,
    saveDate,
    clearDate,
    isSaving,
    isResetOpen,
    openReset,
    closeReset,
    confirmReset,
    isResetting,
  } = useAdminSettingsState()

  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        description="Demo controls. They exist because this build has no backend and cycles last 3 years."
      />

      <Card
        title="Simulated date"
        description="Move “today” forward or back to see cycles begin, fall due and become overdue. Applies to every user in this browser."
        actions={
          <Badge tone={isSimulated ? 'warning' : 'neutral'} icon="calendar">
            {isSimulated ? `Simulating ${effectiveToday}` : `Today: ${effectiveToday}`}
          </Badge>
        }
      >
        <form
          className={styles.dateRow}
          onSubmit={(event) => {
            event.preventDefault()
            saveDate()
          }}
          noValidate
        >
          <TextField
            label="Date"
            type="date"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            error={dateError}
            hint="Leave empty to use the real date."
            disabled={isLoading}
            containerClassName={styles.dateField}
          />
          <div className={styles.dateActions}>
            <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
              Apply date
            </Button>
            {isSimulated && (
              <Button variant="secondary" onClick={clearDate} disabled={isSaving}>
                Use real date
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card
        tone="danger"
        title="Reset demo data"
        description="Deletes every provider, answer and setting in this browser and restores the 8 demo accounts. You’ll be logged out."
        actions={
          <Button variant="danger" leftIcon="delete" onClick={openReset}>
            Reset demo data
          </Button>
        }
      />

      <ConfirmDialog
        open={isResetOpen}
        onClose={closeReset}
        onConfirm={confirmReset}
        isLoading={isResetting}
        tone="danger"
        title="Reset all demo data?"
        confirmLabel="Reset and log out"
      >
        Every change made in this browser is lost, including registered providers.{' '}
        <strong>This cannot be undone.</strong>
      </ConfirmDialog>
    </div>
  )
}
