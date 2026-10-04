import { Outlet } from 'react-router'
import { Spinner } from '@/components/ui/Spinner'
import { ToastViewport } from '@/components/ui/ToastViewport'
import styles from './RootLayout.module.scss'
import { useRootLayoutState } from './RootLayout.state'

/** Top-level route element: verifies a persisted session before rendering, hosts toasts. */
export const RootLayout = () => {
  const { isChecking } = useRootLayoutState()

  return (
    <>
      {isChecking ? (
        <div className={styles.splash}>
          <Spinner size="lg" label="Loading your session" />
        </div>
      ) : (
        <Outlet />
      )}
      <ToastViewport />
    </>
  )
}
