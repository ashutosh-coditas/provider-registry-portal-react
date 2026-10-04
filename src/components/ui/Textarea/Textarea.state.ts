import { useState, type ChangeEvent } from 'react'
import type { TextareaProps } from './Textarea.types'

/** Tracks the character count while keeping the textarea uncontrolled (react-hook-form friendly). */
export const useTextareaState = ({
  value,
  defaultValue,
  onChange,
  maxLength,
  showCount,
}: TextareaProps) => {
  const [length, setLength] = useState(() => String(value ?? defaultValue ?? '').length)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLength(event.target.value.length)
    onChange?.(event)
  }

  const currentLength = value !== undefined ? String(value).length : length

  return {
    handleChange,
    counter: showCount && maxLength ? `${currentLength} / ${maxLength}` : undefined,
  }
}
