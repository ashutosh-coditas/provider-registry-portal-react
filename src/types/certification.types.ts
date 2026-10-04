import type { UserType } from './user.types'

/** One form per cycle. `cycle-1` is the Initial Certification. */
export type FormKey = `cycle-${number}`

export type FormStatus = 'not_started' | 'in_progress' | 'submitted'

export type StepNumber = 1 | 2 | 3 | 4

/** The 20 certification questions (CONTEXT.md §5.2) plus the Q19 follow-up. */
export type QuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8'
  | 'q9'
  | 'q10'
  | 'q11'
  | 'q12'
  | 'q13'
  | 'q14'
  | 'q15'
  | 'q16'
  | 'q17'
  | 'q18'
  | 'q19'
  | 'q19Explanation'
  | 'q20'

/** Text inputs are stored as strings (dates as yyyy-MM-dd); the attestation is a boolean. */
export type AnswerValue = string | boolean

export type Answers = Partial<Record<QuestionId, AnswerValue>>

export interface CertificationForm {
  formKey: FormKey
  status: FormStatus
  /** Step the provider was last on (resume point). */
  currentStep: StepNumber
  /** Steps that passed validation and were saved; length = completion out of 4. */
  completedSteps: StepNumber[]
  answers: Answers
  startedAt: string | null
  updatedAt: string | null
  submittedAt: string | null
}

/** All forms of one user. A missing key means "not started, 0/4". */
export type UserForms = Partial<Record<FormKey, CertificationForm>>

/** All forms in the system, keyed by user id. */
export type FormsTable = Record<string, UserForms>

/**
 * How a certification is presented:
 * - notStarted / inProgress: a candidate's Cycle 1 (Initial Certification)
 * - completed / completedLate: submitted (late = after the cycle ended)
 * - due: current cycle, not submitted
 * - overdue: past cycle, not submitted (still fillable)
 * - upcoming: next cycle, locked
 */
export type CertificationDisplayState =
  'notStarted' | 'inProgress' | 'completed' | 'completedLate' | 'due' | 'overdue' | 'upcoming'

export interface CertificationSummary {
  formKey: FormKey
  cycleNumber: number
  /** Cycle 1: the Initial Certification that makes a candidate a diplomat. */
  isInitial: boolean
  /** "Cycle 2". */
  title: string
  /** "Cycle 1 · Initial Certification" or "Cycle 2 · 2029–2032". */
  name: string
  /** "2026–2029"; null for a candidate's Cycle 1 (it starts on submission). */
  periodLabel: string | null
  startsAt: string | null
  endsAt: string | null
  displayState: CertificationDisplayState
  status: FormStatus
  completion: number
  submittedAt: string | null
  updatedAt: string | null
  /** Days until the cycle ends (due cycles only). */
  daysLeft: number | null
  isReadOnly: boolean
  /** False for the locked upcoming cycle. */
  isAccessible: boolean
}

export interface CertificationOverview {
  /** Effective "today" (yyyy-MM-dd): the simulated date when one is set. */
  today: string
  isSimulated: boolean
  userType: UserType
  certifiedAt: string | null
  currentCycle: number | null
  overdueCount: number
  items: CertificationSummary[]
}

export interface CertificationDetail {
  summary: CertificationSummary
  /** The stored form, or a fresh (possibly pre-filled) one that is saved on first change. */
  form: CertificationForm
  today: string
  /** Form the answers were pre-filled from, for a new cycle form. */
  prefilledFrom: FormKey | null
}
