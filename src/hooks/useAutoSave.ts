import { useEffect, useRef } from 'react'

interface AutoSaveOptions {
  /** Debounce in ms (CONTEXT.md §5.1: about 800 ms). */
  delay?: number
  enabled?: boolean
}

/**
 * Calls `onSave` once `value` has stopped changing for `delay` ms. The first value counts as
 * saved, so mounting a form doesn't trigger a save. Call `markSaved` after an explicit save
 * to skip a duplicate auto-save.
 */
export const useAutoSave = <T>(
  value: T,
  onSave: (value: T) => void,
  { delay = 800, enabled = true }: AutoSaveOptions = {},
) => {
  const serialized = JSON.stringify(value)
  const lastSavedRef = useRef(serialized)
  const onSaveRef = useRef(onSave)

  useEffect(() => {
    onSaveRef.current = onSave
  })

  useEffect(() => {
    if (!enabled || serialized === lastSavedRef.current) return
    const timer = window.setTimeout(() => {
      // An explicit save (Next / Back / Exit) may have stored these values in the meantime.
      if (serialized === lastSavedRef.current) return
      lastSavedRef.current = serialized
      onSaveRef.current(JSON.parse(serialized) as T)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [serialized, delay, enabled])

  return {
    markSaved: (saved: T) => {
      lastSavedRef.current = JSON.stringify(saved)
    },
  }
}
