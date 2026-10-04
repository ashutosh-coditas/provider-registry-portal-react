export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  /** Screen-reader text; set to null when a parent already announces loading. */
  label?: string | null
  className?: string
}
