import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import type { MenuItem, MenuProps } from './Menu.types'

/** Menu button pattern: opens on click, ↑/↓ move between items, Escape closes and refocuses the trigger. */
export const useMenuState = ({ items }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()

  const close = (returnFocus = false) => {
    setIsOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useClickOutside(containerRef, () => close(), isOpen)

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (isOpen) itemRefs.current.find((item) => item && !item.disabled)?.focus()
  }, [isOpen])

  const focusItem = (offset: number) => {
    const enabled = itemRefs.current.filter((item): item is HTMLButtonElement =>
      Boolean(item && !item.disabled),
    )
    const index = enabled.indexOf(document.activeElement as HTMLButtonElement)
    enabled[(index + offset + enabled.length) % enabled.length]?.focus()
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') focusItem(1)
    else if (event.key === 'ArrowUp') focusItem(-1)
    else if (event.key === 'Escape' || event.key === 'Tab') close(event.key === 'Escape')
    else return
    if (event.key !== 'Tab') event.preventDefault()
  }

  const selectItem = (item: MenuItem) => {
    close(true)
    item.onSelect()
  }

  const registerItem = (index: number) => (element: HTMLButtonElement | null) => {
    itemRefs.current[index] = element
  }

  return {
    isOpen,
    menuId,
    containerRef,
    triggerRef,
    toggle: () => setIsOpen((open) => !open),
    handleMenuKeyDown,
    selectItem,
    registerItem,
    items,
  }
}
