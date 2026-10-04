import { useEffect, useRef, type RefObject } from 'react'

/** Calls `onOutside` on pointerdown outside `ref` or on Escape, while `enabled`. */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled = true,
) => {
  // Latest callback without re-subscribing the document listeners on every render.
  const callbackRef = useRef(onOutside)
  useEffect(() => {
    callbackRef.current = onOutside
  })

  useEffect(() => {
    if (!enabled) return
    const handlePointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callbackRef.current()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callbackRef.current()
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, enabled])
}
