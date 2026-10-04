import { IconButton } from '../IconButton'
import { TextField } from '../TextField'
import type { SearchFieldProps } from './SearchField.types'

/** Controlled search box with a clear button. */
export const SearchField = ({
  value,
  onChange,
  label,
  placeholder,
  className,
}: SearchFieldProps) => (
  <TextField
    type="search"
    label={label}
    hideLabel
    leftIcon="search"
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    containerClassName={className}
    rightSlot={
      value ? (
        <IconButton icon="close" label="Clear search" size="sm" onClick={() => onChange('')} />
      ) : undefined
    }
  />
)
