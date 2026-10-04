import clsx from 'clsx'
import { Icon } from '../Icon'
import styles from './Menu.module.scss'
import { useMenuState } from './Menu.state'
import type { MenuProps } from './Menu.types'

export const Menu = (props: MenuProps) => {
  const { trigger, triggerLabel, header, align = 'end', triggerClassName, className } = props
  const {
    isOpen,
    menuId,
    containerRef,
    triggerRef,
    toggle,
    handleMenuKeyDown,
    selectItem,
    registerItem,
    items,
  } = useMenuState(props)

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <button
        ref={triggerRef}
        type="button"
        className={clsx(styles.trigger, triggerClassName)}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={toggle}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={triggerLabel}
          className={clsx(styles.menu, styles[align])}
          onKeyDown={handleMenuKeyDown}
        >
          {header && <div className={styles.header}>{header}</div>}
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={registerItem(index)}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              className={clsx(styles.item, item.tone === 'danger' && styles.danger)}
              onClick={() => selectItem(item)}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
