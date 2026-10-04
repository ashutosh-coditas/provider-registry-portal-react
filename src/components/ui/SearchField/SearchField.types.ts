export interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  /** Accessible label (visually hidden). */
  label: string
  placeholder?: string
  className?: string
}
