import { addYears, differenceInCalendarDays, isAfter, parseISO } from 'date-fns'
import type {
  CertificationDisplayState,
  CertificationSummary,
  FormKey,
  User,
  UserForms,
} from '@/types'

/**
 * Business rules for 3-year cycles (CONTEXT.md §4). Pure functions, shared by the mock API.
 *
 * Cycle 1 IS the Initial Certification: a candidate fills it in, and submitting it makes them a
 * diplomat. Cycle 1's window starts on that date (certifiedAt); Cycle 2 opens 3 years later.
 */

export const CYCLE_LENGTH_YEARS = 3

/** The candidate's form: Cycle 1, the Initial Certification. */
export const INITIAL_FORM_KEY: FormKey = 'cycle-1'

export const INITIAL_CERTIFICATION_NAME = 'Initial Certification'

export const cycleFormKey = (cycleNumber: number): FormKey => `cycle-${cycleNumber}`

export const parseCycleNumber = (formKey: string): number | null => {
  const match = /^cycle-(\d+)$/.exec(formKey)
  return match ? Number(match[1]) : null
}

/** Cycle N covers [certifiedAt + 3(N−1) years, certifiedAt + 3N years). */
export const getCycleRange = (certifiedAt: Date, cycleNumber: number) => ({
  start: addYears(certifiedAt, CYCLE_LENGTH_YEARS * (cycleNumber - 1)),
  end: addYears(certifiedAt, CYCLE_LENGTH_YEARS * cycleNumber),
})

/** Cycle containing `at`. Dates before certification count as Cycle 1. */
export const getCycleNumberAt = (certifiedAt: Date, at: Date) => {
  let cycleNumber = 1
  while (at >= getCycleRange(certifiedAt, cycleNumber).end && cycleNumber < 100) cycleNumber++
  return cycleNumber
}

export const formatCyclePeriod = (start: Date, end: Date) =>
  `${start.getFullYear()}–${end.getFullYear()}`

export const formatCycleLabel = (cycleNumber: number, certifiedAt: Date) => {
  const { start, end } = getCycleRange(certifiedAt, cycleNumber)
  return `Cycle ${cycleNumber} (${formatCyclePeriod(start, end)})`
}

/** "Cycle 1 · Initial Certification" or "Cycle 2 · 2029–2032". */
const buildName = (cycleNumber: number, periodLabel: string | null) =>
  cycleNumber === 1
    ? `Cycle 1 · ${INITIAL_CERTIFICATION_NAME}`
    : `Cycle ${cycleNumber}${periodLabel ? ` · ${periodLabel}` : ''}`

const completionOf = (forms: UserForms, formKey: FormKey) =>
  forms[formKey]?.completedSteps.length ?? 0

/**
 * A candidate sees only Cycle 1. A diplomat sees cycles 1..current, plus the locked next cycle.
 */
export const buildCertificationSummaries = (
  user: Pick<User, 'type' | 'certifiedAt'>,
  forms: UserForms,
  now: Date,
): CertificationSummary[] => {
  if (user.type !== 'diplomat' || !user.certifiedAt) {
    const form = forms[INITIAL_FORM_KEY]
    const completion = completionOf(forms, INITIAL_FORM_KEY)
    return [
      {
        formKey: INITIAL_FORM_KEY,
        cycleNumber: 1,
        isInitial: true,
        title: 'Cycle 1',
        name: buildName(1, null),
        periodLabel: null,
        startsAt: null,
        endsAt: null,
        displayState:
          completion > 0 || form?.status === 'in_progress' ? 'inProgress' : 'notStarted',
        status: form?.status ?? 'not_started',
        completion,
        submittedAt: form?.submittedAt ?? null,
        updatedAt: form?.updatedAt ?? null,
        daysLeft: null,
        isReadOnly: false,
        isAccessible: true,
      },
    ]
  }

  const certifiedAt = parseISO(user.certifiedAt)
  const current = getCycleNumberAt(certifiedAt, now)
  const summaries: CertificationSummary[] = []

  for (let cycleNumber = 1; cycleNumber <= current + 1; cycleNumber++) {
    const formKey = cycleFormKey(cycleNumber)
    const form = forms[formKey]
    const { start, end } = getCycleRange(certifiedAt, cycleNumber)
    const periodLabel = formatCyclePeriod(start, end)
    const isUpcoming = cycleNumber > current
    const isSubmitted = form?.status === 'submitted'

    let displayState: CertificationDisplayState
    if (isUpcoming) displayState = 'upcoming'
    else if (isSubmitted)
      displayState =
        form.submittedAt && isAfter(parseISO(form.submittedAt), end) ? 'completedLate' : 'completed'
    else displayState = cycleNumber < current ? 'overdue' : 'due'

    summaries.push({
      formKey,
      cycleNumber,
      isInitial: cycleNumber === 1,
      title: `Cycle ${cycleNumber}`,
      name: buildName(cycleNumber, periodLabel),
      periodLabel,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      displayState,
      status: form?.status ?? 'not_started',
      completion: completionOf(forms, formKey),
      submittedAt: form?.submittedAt ?? null,
      updatedAt: form?.updatedAt ?? null,
      daysLeft: displayState === 'due' ? differenceInCalendarDays(end, now) : null,
      isReadOnly: isSubmitted,
      isAccessible: !isUpcoming,
    })
  }

  return summaries
}

/** The cycle a provider is in now: Cycle 1 for candidates, the current cycle for diplomats. */
export const getCurrentSummary = (summaries: CertificationSummary[]) =>
  summaries.filter((item) => item.isAccessible).at(-1) ?? summaries[0]

export const countOverdue = (summaries: CertificationSummary[]) =>
  summaries.filter((item) => item.displayState === 'overdue').length
