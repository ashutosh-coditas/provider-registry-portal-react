import { useState } from 'react'

/** Open/close state for modals, menus and drawers. */
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((value) => !value),
  }
}
