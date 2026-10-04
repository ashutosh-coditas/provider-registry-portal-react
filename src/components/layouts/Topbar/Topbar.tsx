import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Logo } from '@/components/ui/Logo'
import { Menu } from '@/components/ui/Menu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ENV } from '@/constants/env'
import { DemoSwitcher } from '../DemoSwitcher'
import styles from './Topbar.module.scss'
import { useTopbarState } from './Topbar.state'
import type { TopbarProps } from './Topbar.types'

export const Topbar = ({ showMenuButton, onOpenMenu }: TopbarProps) => {
  const { name, username, roleLabel, roleTone, menuItems } = useTopbarState()

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {showMenuButton && (
          <>
            <IconButton
              icon="menu"
              label="Open navigation"
              onClick={onOpenMenu}
              aria-controls="app-sidebar"
            />
            <Logo compact />
          </>
        )}
      </div>

      <div className={styles.right}>
        {ENV.showDemoTools && <DemoSwitcher />}
        <ThemeToggle />
        <Menu
          triggerLabel={`Account: ${name}`}
          trigger={
            <>
              <Avatar name={name} size="sm" />
              <span className={styles.identity}>
                <span className={styles.name}>{name}</span>
                <span className={styles.role}>{roleLabel}</span>
              </span>
              <Icon name="chevronDown" size={16} className={styles.chevron} />
            </>
          }
          header={
            <div className={styles.menuHeader}>
              <Avatar name={name} size="md" />
              <div className={styles.menuIdentity}>
                <span className={styles.name}>{name}</span>
                <span className={styles.username}>@{username}</span>
              </div>
              <Badge tone={roleTone} size="sm">
                {roleLabel}
              </Badge>
            </div>
          }
          items={menuItems}
        />
      </div>
    </header>
  )
}
