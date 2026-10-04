import clsx from 'clsx'
import { NavLink } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Logo } from '@/components/ui/Logo'
import styles from './Sidebar.module.scss'
import { useSidebarState } from './Sidebar.state'
import type { SidebarProps } from './Sidebar.types'

export const Sidebar = (props: SidebarProps) => {
  const { navGroups, isDesktop, isCollapsed, isMobileOpen, onToggleCollapsed, onCloseMobile } =
    props
  useSidebarState(props)

  return (
    <>
      {isMobileOpen && (
        <div className={styles.backdrop} onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        id="app-sidebar"
        className={clsx(
          styles.sidebar,
          isCollapsed && styles.collapsed,
          isMobileOpen && styles.mobileOpen,
        )}
        aria-label="Sidebar"
      >
        <div className={styles.brand}>
          <Logo compact={isCollapsed} />
          {!isDesktop && (
            <IconButton icon="close" label="Close navigation" size="sm" onClick={onCloseMobile} />
          )}
        </div>

        <nav className={styles.nav} aria-label="Main">
          {navGroups.map((group) => (
            <div key={group.id} className={styles.group}>
              {group.title && (
                <p className={styles.groupTitle} aria-hidden={isCollapsed || undefined}>
                  {group.title}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={item.icon} size={20} weight={isActive ? 'fill' : 'regular'} />
                      <span className={styles.linkLabel}>{item.label}</span>
                      {item.status && (
                        <span className={clsx(styles.dot, styles[item.status])}>
                          <span className="sr-only">{item.statusLabel}</span>
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {isDesktop && (
          <button
            type="button"
            className={styles.collapseButton}
            onClick={onToggleCollapsed}
            aria-expanded={!isCollapsed}
            aria-controls="app-sidebar"
          >
            <Icon name="sidebar" size={20} />
            <span className={styles.linkLabel}>{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        )}
      </aside>
    </>
  )
}
