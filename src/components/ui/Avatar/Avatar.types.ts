export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  /** Full name; initials are derived from it ("Dr." is skipped). */
  name: string
  size?: AvatarSize
  className?: string
}
