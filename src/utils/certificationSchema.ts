import { addMonths, differenceInYears, format } from 'date-fns'
import { z } from 'zod'
import { getStepFieldIds, MIN_CME_CREDITS, SPECIALTIES } from '@/constants/certification'
import type { AnswerValue, Answers, StepNumber } from '@/types'
import { parseDateKey } from './dates'
import { isValidNpi } from './npi'

/** Validation for the 20 certification questions (CONTEXT.md §5.2). */

export interface SchemaContext {
  /** Effective today (respects the simulated date). */
  today: Date
  /** Saved answers, for rules that span steps (Q7 needs Q2, Q17 needs Q7). */
  answers: Answers
}

export type StepValues = Record<string, AnswerValue>

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/

const text = (requiredMessage: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .min(min, `Enter at least ${min} characters`)
    .max(max, `Keep it under ${max + 1} characters`)

const date = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine((value) => parseDateKey(value) !== null, 'Enter a valid date')

/** Runs a date rule only when the value is a valid date (format errors are reported once). */
const onDate = (rule: (value: Date) => boolean) => (value: string) => {
  const parsed = parseDateKey(value)
  return !parsed || rule(parsed)
}

const stepOne = ({ today }: SchemaContext) =>
  z.object({
    q1: text('Enter your full legal name', 2, 100).regex(
      NAME_PATTERN,
      "Use letters, spaces, . ' and - only",
    ),
    q2: date('Enter your date of birth').refine(
      onDate((value) => {
        const age = differenceInYears(today, value)
        return age >= 24 && age <= 90
      }),
      'Age must be between 24 and 90',
    ),
    q3: z.string().min(1, 'Choose your nationality'),
    q4: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, 'Enter your passport number')
      .regex(/^[A-Z0-9]{6,9}$/, 'Use 6–9 letters or digits'),
    q5: date('Enter the passport expiry date').refine(
      onDate((value) => value >= addMonths(today, 6)),
      `Must be on or after ${format(addMonths(today, 6), 'd MMM yyyy')} (6 months from today)`,
    ),
  })

const stepTwo = ({ today, answers }: SchemaContext) => {
  const birthDate = parseDateKey(String(answers.q2 ?? ''))
  const currentYear = today.getFullYear()

  return z.object({
    q6: text('Enter your medical school', 3, 150),
    q7: z
      .string()
      .trim()
      .min(1, 'Enter your graduation year')
      .regex(/^\d{4}$/, 'Enter a 4-digit year')
      .refine((value) => Number(value) <= currentYear, `Year can’t be after ${currentYear}`)
      .refine(
        (value) => !birthDate || Number(value) >= birthDate.getFullYear() + 20,
        birthDate
          ? `Must be ${birthDate.getFullYear() + 20} or later (20 years after your birth year)`
          : '',
      ),
    q8: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, 'Enter your medical license number')
      .regex(/^[A-Z0-9-]{5,20}$/, 'Use 5–20 letters, digits or hyphens'),
    q9: text('Enter the issuing authority', 2, 100),
    q10: date('Enter the license expiry date').refine(
      onDate((value) => value > today),
      'Your license has expired. Renew it before you continue.',
    ),
  })
}

const stepThree = () =>
  z.object({
    q11: z
      .string()
      .min(1, 'Choose your primary specialty')
      .refine(
        (value) => (SPECIALTIES as readonly string[]).includes(value),
        'Choose from the list',
      ),
    q12: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, 'Enter your board certificate number')
      .regex(/^BC-\d{6}$/, 'Use BC- followed by 6 digits, e.g. BC-123456'),
    q13: z
      .string()
      .trim()
      .min(1, 'Enter your NPI number')
      .regex(/^\d{10}$/, 'Enter exactly 10 digits')
      .refine(isValidNpi, 'This NPI is not valid. Check the digits and try again.'),
    q14: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, 'Enter your DEA registration number')
      .regex(/^[A-Z]{2}\d{7}$/, 'Use 2 letters followed by 7 digits, e.g. AB1234567'),
    q15: z
      .string()
      .trim()
      .regex(/^([A-Za-z0-9]{4,15})?$/, 'Use 4–15 letters or digits, or leave it empty'),
  })

const stepFour = ({ today, answers }: SchemaContext) => {
  const graduationYear = Number(answers.q7)
  const maxYears =
    Number.isFinite(graduationYear) && graduationYear > 0
      ? today.getFullYear() - graduationYear
      : 60

  return z
    .object({
      q16: text('Enter your primary practice or hospital', 2, 150),
      q17: z
        .string()
        .trim()
        .min(1, 'Enter your years in practice')
        .regex(/^\d{1,2}$/, 'Enter a whole number')
        .refine((value) => Number(value) <= 60, 'Enter 60 or fewer')
        .refine(
          (value) => Number(value) <= maxYears,
          `Can’t be more than ${maxYears} years (since your graduation in ${graduationYear})`,
        ),
      q18: z
        .string()
        .trim()
        .min(1, 'Enter your CME credits')
        .regex(/^\d{1,3}$/, 'Enter a whole number')
        .refine((value) => Number(value) <= 500, 'Enter 500 or fewer')
        .refine(
          (value) => Number(value) >= MIN_CME_CREDITS,
          `At least ${MIN_CME_CREDITS} CME credits are required to submit`,
        ),
      q19: z.string().refine((value) => value === 'yes' || value === 'no', 'Choose Yes or No'),
      q19Explanation: z.string().trim(),
      q20: z.boolean().refine((value) => value, 'Confirm the attestation to submit'),
    })
    .superRefine((values, ctx) => {
      if (values.q19 !== 'yes') return
      const length = values.q19Explanation.length
      if (length < 20 || length > 1000) {
        ctx.addIssue({
          code: 'custom',
          path: ['q19Explanation'],
          message:
            length < 20 ? 'Explain in at least 20 characters' : 'Keep it under 1000 characters',
        })
      }
    })
}

const STEP_SCHEMAS = { 1: stepOne, 2: stepTwo, 3: stepThree, 4: stepFour } as const

export const getStepSchema = (step: StepNumber, context: SchemaContext) =>
  STEP_SCHEMAS[step](context)

/** Initial values for a step's form: saved answers, or empty. */
export const getStepDefaults = (step: StepNumber, answers: Answers): StepValues =>
  Object.fromEntries(
    getStepFieldIds(step).map((id) => [id, answers[id] ?? (id === 'q20' ? false : '')]),
  )

export const isStepValid = (step: StepNumber, values: StepValues, context: SchemaContext) =>
  getStepSchema(step, context).safeParse(values).success
