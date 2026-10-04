import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/router/paths'
import { useRegisterMutation } from '@/services/auth'
import { toApiError } from '@/utils/apiError'
import { PASSWORD_RULES } from '@/utils/validators'
import type { LoginLocationState } from '../Login'
import { registerSchema, type PasswordCheck, type RegisterFormValues } from './Register.types'

export const useRegisterState = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [registerUser, { isLoading }] = useRegisterMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', username: '', password: '' },
  })

  const password = useWatch({ control: form.control, name: 'password' })
  const passwordChecks: PasswordCheck[] = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    met: rule.test(password),
  }))

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      const { user } = await registerUser(values).unwrap()
      toast.success('Registration successful. Please log in.')
      const state: LoginLocationState = { username: user.username }
      navigate(ROUTES.login, { replace: true, state })
    } catch (error) {
      const { status, message } = toApiError(error)
      if (status === 409) form.setError('username', { message }, { shouldFocus: true })
      else setFormError(message)
    }
  })

  return { form, onSubmit, isLoading, formError, passwordChecks }
}
