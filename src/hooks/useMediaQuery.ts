import { useSyncExternalStore } from 'react'

/** Live boolean for a CSS media query, e.g. useMediaQuery('(max-width: 767.98px)'). */
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
