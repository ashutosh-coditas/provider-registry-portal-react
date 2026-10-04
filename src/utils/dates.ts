import { format, isValid, parse, parseISO } from 'date-fns'

export const DATE_FORMAT = 'yyyy-MM-dd'

/** "2026-10-04T…" or a Date → "2026-10-04". */
export const toDateKey = (value: string | Date) =>
  format(typeof value === 'string' ? parseISO(value) : value, DATE_FORMAT)

/** Parses "yyyy-MM-dd" as a local date; null when invalid. */
export const parseDateKey = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = parse(value, DATE_FORMAT, new Date())
  return isValid(date) ? date : null
}

/** Display format used across the UI ("4 Oct 2026"). */
export const formatDisplayDate = (value: string | Date | null | undefined) => {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  return isValid(date) ? format(date, 'd MMM yyyy') : '—'
}

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—'
  const date = parseISO(value)
  return isValid(date) ? format(date, "d MMM yyyy 'at' HH:mm") : '—'
}
