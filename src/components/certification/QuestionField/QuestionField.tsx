import clsx from 'clsx'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { TextField } from '@/components/ui/TextField'
import { Textarea } from '@/components/ui/Textarea'
import styles from './QuestionField.module.scss'
import type { QuestionFieldProps } from './QuestionField.types'

/** Renders one certification question from its config, wired to react-hook-form. */
export const QuestionField = ({ question, register, errors, showFollowUp }: QuestionFieldProps) => {
  const { id, type, label, hint, placeholder, optional, options = [] } = question
  const error = errors[id]?.message as string | undefined
  const className = clsx(question.fullWidth && styles.fullWidth)

  switch (type) {
    case 'select':
      return (
        <Select
          label={label}
          hint={hint}
          error={error}
          required={!optional}
          placeholder={placeholder}
          options={options}
          containerClassName={className}
          {...register(id)}
        />
      )

    case 'radio':
      return (
        <div className={clsx(styles.group, className)}>
          <RadioGroup label={label} options={options} error={error} required {...register(id)} />
          {showFollowUp && (
            <Textarea
              label="Explain the claim or action"
              hint="What happened, when, and how it was resolved (20–1000 characters)"
              error={errors.q19Explanation?.message as string | undefined}
              maxLength={1000}
              showCount
              rows={3}
              required
              {...register('q19Explanation')}
            />
          )}
        </div>
      )

    case 'checkbox':
      return (
        <div className={clsx(styles.attestation, className)}>
          <Checkbox
            label={label}
            description="Required for every certification. False statements can lead to loss of Diplomat status."
            error={error}
            {...register(id)}
          />
        </div>
      )

    default:
      return (
        <TextField
          label={label}
          hint={hint}
          error={error}
          required={!optional}
          optional={optional}
          placeholder={placeholder}
          type={type === 'date' ? 'date' : 'text'}
          inputMode={question.inputMode}
          maxLength={question.maxLength}
          autoComplete="off"
          className={clsx(question.uppercase && styles.uppercase)}
          containerClassName={className}
          {...register(id)}
        />
      )
  }
}
