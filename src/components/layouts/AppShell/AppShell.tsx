import clsx from 'clsx'
import { Outlet } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { LinkButton } from '@/components/ui/LinkButton'
import { ROUTES } from '@/router/paths'
import { Sidebar } from '../Sidebar'
import { Topbar } from '../Topbar'
import styles from './AppShell.module.scss'
import { useAppShellState } from './AppShell.state'

/** Authenticated layout: role-based sidebar (collapsible / mobile drawer), top bar, page content. */
export const AppShell = () => {
  const {
    navGroups,
    isDesktop,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    openMobile,
    closeMobile,
    simulatedDate,
    canChangeDate,
  } = useAppShellState()

  return (
    <div className={clsx(styles.shell, isCollapsed && styles.collapsed)}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>

      <Sidebar
        navGroups={navGroups}
        isDesktop={isDesktop}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={closeMobile}
      />

      <div className={styles.main}>
        <Topbar showMenuButton={!isDesktop} onOpenMenu={openMobile} />
        <main id="main-content" className={styles.content} tabIndex={-1}>
          {simulatedDate && (
            <Alert
              tone="warning"
              title={`Simulated date: ${simulatedDate}`}
              className={styles.banner}
              action={
                canChangeDate ? (
                  <LinkButton to={ROUTES.adminSettings} variant="secondary" size="sm">
                    Change
                  </LinkButton>
                ) : undefined
              }
            >
              Cycles, due dates and validation use this date instead of today.
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
