import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { DEMO_ACCOUNTS } from '@/constants/demo'
import { ENV } from '@/constants/env'
import { useLoginMutation } from '@/services/auth'
import { toApiError } from '@/utils/apiError'
import { loginSchema, type LoginFormValues, type LoginLocationState } from './Login.types'

export const useLoginState = () => {
  const location = useLocation()
  const locationState = (location.state ?? {}) as LoginLocationState
  const [login, { isLoading }] = useLoginMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { username: locationState.username ?? '', password: '' },
  })

  // On success the auth slice stores the user and GuestOnly redirects to the right home page.
  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values).unwrap()
    } catch (error) {
      setFormError(toApiError(error).message)
    }
  })

  const fillDemoAccount = (username: string, password: string) => {
    form.reset({ username, password })
    setFormError(null)
  }

  return {
    form,
    onSubmit,
    isLoading,
    formError,
    demoAccounts: ENV.showDemoTools ? DEMO_ACCOUNTS : [],
    fillDemoAccount,
  }
}
