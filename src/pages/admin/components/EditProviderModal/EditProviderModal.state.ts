import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ROLE_LABEL } from '@/constants/roles'
import { useToast } from '@/hooks/useToast'
import { useResetProviderProgressMutation, useUpdateProviderMutation } from '@/services/providers'
import { useGetSettingsQuery } from '@/services/settings'
import { toApiError } from '@/utils/apiError'
import { parseDateKey, toDateKey } from '@/utils/dates'
import {
  buildEditProviderSchema,
  type EditProviderModalProps,
  type EditProviderValues,
} from './EditProviderModal.types'

export const useEditProviderModalState = ({ provider, onClose }: EditProviderModalProps) => {
  const toast = useToast()
  const { data: settings } = useGetSettingsQuery()
  const [updateProvider, { isLoading: isSaving }] = useUpdateProviderMutation()
  const [resetProgress, { isLoading: isResetting }] = useResetProviderProgressMutation()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [completion, setCompletion] = useState(provider.completion)

  const isDiplomat = provider.type === 'diplomat'
  // Real date captured once, used only until settings load.
  const [fallbackToday] = useState(() => new Date())
  const today = (settings && parseDateKey(settings.today)) || fallbackToday

  const form = useForm<EditProviderValues>({
    resolver: zodResolver(buildEditProviderSchema(isDiplomat, today)),
    mode: 'onTouched',
    defaultValues: {
      name: provider.name,
      username: provider.username,
      certifiedAt: provider.certifiedAt ? toDateKey(provider.certifiedAt) : '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateProvider({
        id: provider.id,
        name: values.name,
        username: values.username,
        certifiedAt: isDiplomat ? values.certifiedAt : undefined,
      }).unwrap()
      toast.success(`${values.name} was updated.`)
      onClose()
    } catch (error) {
      const { status, message } = toApiError(error)
      if (status === 409) form.setError('username', { message }, { shouldFocus: true })
      else toast.error(message, { title: 'Couldn’t save' })
    }
  })

  const confirmReset = async () => {
    try {
      const updated = await resetProgress(provider.id).unwrap()
      setCompletion(updated.completion)
      setIsResetOpen(false)
      toast.success('Current form progress was reset to 0/4.')
    } catch (error) {
      toast.error(toApiError(error).message, { title: 'Couldn’t reset' })
    }
  }

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    isSaving,
    isDiplomat,
    typeLabel: ROLE_LABEL[provider.type],
    formLabel: isDiplomat ? provider.cycleLabel : 'Cycle 1 · Initial Certification',
    completion,
    // A diplomat's Cycle 1 is the Initial Certification that made them a diplomat.
    canReset: completion > 0 && !(isDiplomat && provider.currentFormKey === 'cycle-1'),
    maxDate: toDateKey(today),
    isResetOpen,
    openReset: () => setIsResetOpen(true),
    closeReset: () => setIsResetOpen(false),
    confirmReset,
    isResetting,
  }
}
