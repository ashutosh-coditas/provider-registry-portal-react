import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Tabs.module.scss'
import { useTabsState } from './Tabs.state'
import type { TabsProps } from './Tabs.types'

/** Tab list (e.g. the diplomat cycle switcher). The consumer renders the panel. */
export const Tabs = <T extends string>(props: TabsProps<T>) => {
  const { items, value, onChange, label, panelId, variant = 'underline', className } = props
  const { handleKeyDown, registerTab } = useTabsState(props)

  return (
    <div
      className={clsx(styles.tabs, styles[variant], className)}
      role="tablist"
      aria-label={label}
    >
      {items.map((item, index) => {
        const isSelected = item.value === value
        return (
          <button
            key={item.value}
            ref={registerTab(index)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            className={clsx(styles.tab, isSelected && styles.selected)}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.icon && <Icon name={item.icon} size={16} />}
            {item.label}
            {item.count !== undefined && (
              <span className={clsx(styles.count, item.alert && styles.countAlert)}>
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
