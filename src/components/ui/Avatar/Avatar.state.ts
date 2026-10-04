const TITLES = new Set(['dr', 'dr.', 'mr', 'mr.', 'ms', 'ms.', 'mrs', 'mrs.'])

/** "Dr. Meera Iyer" → "MI". */
export const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part && !TITLES.has(part.toLowerCase()))
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || '?'
}
