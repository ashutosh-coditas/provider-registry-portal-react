import clsx from 'clsx'
import { Link } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { ROUTES } from '@/router/paths'
import styles from './Register.module.scss'
import { useRegisterState } from './Register.state'

export const RegisterPage = () => {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    formError,
    passwordChecks,
  } = useRegisterState()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>
          Create your provider account, then complete Cycle 1, your Initial Certification.
        </p>
      </header>

      {formError && <Alert tone="danger">{formError}</Alert>}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="Dr. Ananya Mehta"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Username"
          autoComplete="username"
          autoCapitalize="none"
          hint="Lowercase letters, digits, . and _"
          error={errors.username?.message}
          {...register('username')}
        />
        <div className={styles.passwordGroup}>
          <PasswordField
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <ul
            id="register-password-rules"
            className={styles.rules}
            aria-label="Password requirements"
          >
            {passwordChecks.map((check) => (
              <li key={check.label} className={clsx(styles.rule, check.met && styles.ruleMet)}>
                <Icon
                  name={check.met ? 'checkCircle' : 'check'}
                  size={14}
                  weight={check.met ? 'fill' : 'regular'}
                />
                {check.label}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>

      <p className={styles.footer}>
        Already registered? <Link to={ROUTES.login}>Log in</Link>
      </p>
    </div>
  )
}
