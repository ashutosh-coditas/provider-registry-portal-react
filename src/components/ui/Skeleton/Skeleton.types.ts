export interface SkeletonProps {
  /** CSS width, e.g. 120 or '60%'. Defaults to 100%. */
  width?: number | string
  /** CSS height. Defaults to one line of text. */
  height?: number | string
  shape?: 'text' | 'rect' | 'circle'
  className?: string
}
