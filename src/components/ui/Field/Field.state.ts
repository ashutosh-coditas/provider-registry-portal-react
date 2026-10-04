import { useId } from 'react'

export const getHintId = (id: string) => `${id}-hint`
export const getErrorId = (id: string) => `${id}-error`

/**
 * ids + aria wiring for a control inside <Field>. Pass the control's own `id` if it has one.
 * Returns props to spread on the control.
 */
export const useFieldControl = ({
  id,
  hint,
  error,
}: {
  id?: string
  hint?: unknown
  error?: string
}) => {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const describedBy = error ? getErrorId(controlId) : hint ? getHintId(controlId) : undefined

  return {
    controlId,
    controlProps: {
      id: controlId,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
    },
  }
}
