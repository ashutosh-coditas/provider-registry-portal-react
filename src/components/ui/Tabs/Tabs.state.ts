import { useRef, type KeyboardEvent } from 'react'
import type { TabsProps } from './Tabs.types'

/** Roving focus: ←/→ move between tabs, Home/End jump to the ends (WAI-ARIA tabs pattern). */
export const useTabsState = <T extends string>({ items, onChange }: TabsProps<T>) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1
    const nextIndex: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const target = nextIndex[event.key]
    if (target === undefined) return
    event.preventDefault()
    tabRefs.current[target]?.focus()
    onChange(items[target].value)
  }

  const registerTab = (index: number) => (element: HTMLButtonElement | null) => {
    tabRefs.current[index] = element
  }

  return { handleKeyDown, registerTab }
}
