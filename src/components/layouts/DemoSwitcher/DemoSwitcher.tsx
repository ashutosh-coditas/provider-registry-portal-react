import { Icon } from '@/components/ui/Icon'
import { Menu } from '@/components/ui/Menu'
import styles from './DemoSwitcher.module.scss'
import { useDemoSwitcherState } from './DemoSwitcher.state'

export const DemoSwitcher = () => {
  const { items } = useDemoSwitcherState()

  return (
    <Menu
      triggerLabel="Switch demo user"
      triggerClassName={styles.trigger}
      trigger={
        <>
          <Icon name="users" size={18} />
          <span className={styles.label}>Demo users</span>
        </>
      }
      header={<p className={styles.header}>Sign in as a seeded account. Demo builds only.</p>}
      items={items}
    />
  )
}
