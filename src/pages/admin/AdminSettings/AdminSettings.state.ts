import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import {
  useGetSettingsQuery,
  useResetDemoDataMutation,
  useUpdateSettingsMutation,
} from '@/services/settings'
import { toApiError } from '@/utils/apiError'
import { formatDisplayDate, parseDateKey } from '@/utils/dates'

export const useAdminSettingsState = () => {
  const toast = useToast()
  const { data: settings, isLoading } = useGetSettingsQuery()
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation()
  const [resetDemoData, { isLoading: isResetting }] = useResetDemoDataMutation()

  // Unsaved edit; falls back to the stored value.
  const [draftDate, setDraftDate] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | undefined>()
  const [isResetOpen, setIsResetOpen] = useState(false)

  const storedDate = settings?.simulatedDate ?? ''
  const value = draftDate ?? storedDate

  const save = async (simulatedDate: string | null) => {
    if (simulatedDate !== null && !parseDateKey(simulatedDate)) {
      setDateError('Enter a valid date')
      return
    }
    try {
      await updateSettings({ simulatedDate }).unwrap()
      setDraftDate(null)
      setDateError(undefined)
      toast.success(
        simulatedDate
          ? `Simulated date set to ${formatDisplayDate(parseDateKey(simulatedDate))}.`
          : 'Simulated date cleared. The app uses today’s date.',
      )
    } catch (error) {
      toast.error(toApiError(error).message, { title: 'Couldn’t save' })
    }
  }

  const confirmReset = async () => {
    try {
      // Resetting wipes every user (including this admin), so the session ends and the
      // guards send us to the login page.
      await resetDemoData().unwrap()
      toast.success('Demo data was reset. Log in again with a demo account.')
    } catch (error) {
      toast.error(toApiError(error).message, { title: 'Couldn’t reset' })
      setIsResetOpen(false)
    }
  }

  return {
    isLoading,
    value,
    setValue: (next: string) => {
      setDraftDate(next)
      setDateError(undefined)
    },
    dateError,
    isDirty: value !== storedDate,
    isSimulated: Boolean(settings?.simulatedDate),
    effectiveToday: formatDisplayDate(settings?.today ? parseDateKey(settings.today) : null),
    saveDate: () => save(value || null),
    clearDate: () => save(null),
    isSaving,
    isResetOpen,
    openReset: () => setIsResetOpen(true),
    closeReset: () => setIsResetOpen(false),
    confirmReset,
    isResetting,
  }
}
