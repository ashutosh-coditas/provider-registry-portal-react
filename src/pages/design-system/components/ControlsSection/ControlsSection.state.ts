import type { SelectOption } from '@/components/ui/Select'

export const SPECIALTY_OPTIONS: SelectOption[] = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'radiology', label: 'Radiology' },
]

export const MALPRACTICE_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes', description: 'Explain below' },
]
