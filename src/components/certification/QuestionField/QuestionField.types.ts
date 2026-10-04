import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { QuestionConfig } from '@/constants/certification'
import type { StepValues } from '@/utils/certificationSchema'

export interface QuestionFieldProps {
  question: QuestionConfig
  register: UseFormRegister<StepValues>
  errors: FieldErrors<StepValues>
  /** Q19: show the explanation box (answer is "yes"). */
  showFollowUp?: boolean
}
