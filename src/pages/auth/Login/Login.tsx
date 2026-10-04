import { Link } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { ROUTES } from '@/router/paths'
import styles from './Login.module.scss'
import { useLoginState } from './Login.state'

export const LoginPage = () => {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    formError,
    demoAccounts,
    fillDemoAccount,
  } = useLoginState()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>Continue your certification or manage providers.</p>
      </header>

      {formError && <Alert tone="danger">{formError}</Alert>}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          label="Username"
          autoComplete="username"
          autoCapitalize="none"
          error={errors.username?.message}
          {...register('username')}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
          Log in
        </Button>
      </form>

      <p className={styles.footer}>
        New provider? <Link to={ROUTES.register}>Create an account</Link>
      </p>

      {demoAccounts.length > 0 && (
        <details className={styles.demo}>
          <summary>Demo accounts</summary>
          <ul className={styles.demoList}>
            {demoAccounts.map((account) => (
              <li key={account.username}>
                <button
                  type="button"
                  className={styles.demoButton}
                  onClick={() => fillDemoAccount(account.username, account.password)}
                >
                  <code>{account.username}</code>
                  <span>{account.scenario}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
