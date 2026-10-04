import type { ReactNode } from 'react'

export interface ShowcaseBlockProps {
  title: string
  /** When and why to use the component. */
  usage?: string
  /** Lay children out in a wrapping row (buttons, badges) instead of a column. */
  inline?: boolean
  children: ReactNode
}

export interface ShowcaseSectionProps {
  id: string
  title: string
  description: string
  children: ReactNode
}
