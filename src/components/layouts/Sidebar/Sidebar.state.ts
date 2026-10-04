import { useEffect } from 'react'
import type { SidebarProps } from './Sidebar.types'

/** Mobile drawer: Escape closes it. */
export const useSidebarState = ({ isMobileOpen, onCloseMobile }: SidebarProps) => {
  useEffect(() => {
    if (!isMobileOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseMobile()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isMobileOpen, onCloseMobile])
}
