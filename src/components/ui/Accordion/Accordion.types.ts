import type { ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: ReactNode
  /** Right side of the header, e.g. a status badge. Must not be interactive. */
  meta?: ReactNode
  content: ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  /** Ids open on first render. */
  defaultOpenIds?: string[]
  className?: string
}
