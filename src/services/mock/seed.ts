import { addMonths, addYears, subMonths, subYears } from 'date-fns'
import type {
  Answers,
  CertificationForm,
  FormKey,
  FormsTable,
  StepNumber,
  User,
  UserType,
} from '@/types'
import { toDateKey } from '@/utils/dates'
import { buildNpi } from '@/utils/npi'

/** Bump when the seed or storage schema changes: existing browsers reload the seed. */
export const SEED_VERSION = 3

const iso = (date: Date) => date.toISOString()

interface SeedUserInput {
  id: string
  name: string
  username: string
  password: string
  type: UserType
  createdAt: Date
  certifiedAt?: Date
}

const makeUser = ({ certifiedAt, createdAt, ...user }: SeedUserInput): User => ({
  ...user,
  certifiedAt: certifiedAt ? iso(certifiedAt) : null,
  createdAt: iso(createdAt),
  updatedAt: iso(createdAt),
})

/** Per-provider facts used to generate valid answers. */
interface Profile {
  legalName: string
  birthDate: string
  nationality: string
  passport: string
  school: string
  graduationYear: number
  license: string
  authority: string
  specialty: string
  npiBase: string
  dea: string
  memberId: string
  practice: string
  malpractice?: string
}

const STEP_FIELDS: Record<StepNumber, (keyof Answers)[]> = {
  1: ['q1', 'q2', 'q3', 'q4', 'q5'],
  2: ['q6', 'q7', 'q8', 'q9', 'q10'],
  3: ['q11', 'q12', 'q13', 'q14', 'q15'],
  4: ['q16', 'q17', 'q18', 'q19', 'q19Explanation', 'q20'],
}

/** Valid answers for steps 1..`steps`, as they would have been entered at `at`. */
const buildAnswers = (profile: Profile, at: Date, steps: number): Answers => {
  const all: Answers = {
    q1: profile.legalName,
    q2: profile.birthDate,
    q3: profile.nationality,
    q4: profile.passport,
    q5: toDateKey(addYears(at, 4)),
    q6: profile.school,
    q7: String(profile.graduationYear),
    q8: profile.license,
    q9: profile.authority,
    q10: toDateKey(addYears(at, 2)),
    q11: profile.specialty,
    q12: `BC-${profile.npiBase.slice(0, 6)}`,
    q13: buildNpi(profile.npiBase),
    q14: profile.dea,
    q15: profile.memberId,
    q16: profile.practice,
    q17: String(Math.max(0, at.getFullYear() - profile.graduationYear - 1)),
    q18: '64',
    q19: profile.malpractice ? 'yes' : 'no',
    q19Explanation: profile.malpractice ?? '',
    q20: true,
  }
  const fields = ([1, 2, 3, 4] as const)
    .filter((step) => step <= steps)
    .flatMap((step) => STEP_FIELDS[step])
  return Object.fromEntries(fields.map((field) => [field, all[field]]))
}

/**
 * A form with `completed` saved steps, started at `startedAt`.
 * Pass `submittedAt` for a submitted form (all 4 steps).
 */
const makeForm = (
  formKey: FormKey,
  profile: Profile,
  completed: number,
  startedAt: Date,
  submittedAt?: Date,
): CertificationForm => {
  const steps = submittedAt ? 4 : completed
  const updatedAt = submittedAt ?? addMonths(startedAt, completed)
  return {
    formKey,
    status: submittedAt ? 'submitted' : steps > 0 ? 'in_progress' : 'not_started',
    currentStep: Math.min(steps + 1, 4) as StepNumber,
    completedSteps: Array.from({ length: steps }, (_, i) => (i + 1) as StepNumber),
    answers: buildAnswers(profile, updatedAt, steps),
    startedAt: iso(startedAt),
    updatedAt: iso(updatedAt),
    submittedAt: submittedAt ? iso(submittedAt) : null,
  }
}

const PROFILES: Record<string, Profile> = {
  partial: {
    legalName: 'Rohan Kulkarni',
    birthDate: '1988-03-14',
    nationality: 'India',
    passport: 'N4821736',
    school: 'Seth GS Medical College, Mumbai',
    graduationYear: 2012,
    license: 'MH-2012-55210',
    authority: 'Maharashtra Medical Council',
    specialty: 'Internal Medicine',
    npiBase: '154827361',
    dea: 'RK4827361',
    memberId: '',
    practice: 'KEM Hospital, Mumbai',
  },
  ready: {
    legalName: 'Sara Fernandes',
    birthDate: '1990-11-02',
    nationality: 'Portugal',
    passport: 'CB728193',
    school: 'University of Lisbon Faculty of Medicine',
    graduationYear: 2014,
    license: 'OM-58213',
    authority: 'Ordem dos Médicos',
    specialty: 'Pediatrics',
    npiBase: '167283910',
    dea: 'SF7283910',
    memberId: 'AAP58213',
    practice: 'Hospital de Santa Maria, Lisbon',
  },
  fresh: {
    legalName: 'Vikram Shah',
    birthDate: '1986-07-21',
    nationality: 'India',
    passport: 'P9031827',
    school: 'B. J. Medical College, Ahmedabad',
    graduationYear: 2010,
    license: 'GJ-2010-31877',
    authority: 'Gujarat Medical Council',
    specialty: 'Cardiology',
    npiBase: '193847261',
    dea: 'VS3847261',
    memberId: 'CSI3847',
    practice: 'Sterling Hospital, Ahmedabad',
  },
  ontrack: {
    legalName: 'Meera Iyer',
    birthDate: '1984-06-12',
    nationality: 'India',
    passport: 'Z1234567',
    school: 'All India Institute of Medical Sciences',
    graduationYear: 2008,
    license: 'DL-2008-45123',
    authority: 'Delhi Medical Council',
    specialty: 'Dermatology',
    npiBase: '123456789',
    dea: 'MI2345678',
    memberId: 'IADVL4512',
    practice: 'Apollo Hospital, Delhi',
  },
  overdue: {
    legalName: 'Karan Rao',
    birthDate: '1981-01-30',
    nationality: 'India',
    passport: 'K7712093',
    school: 'Kasturba Medical College, Manipal',
    graduationYear: 2005,
    license: 'KA-2005-12093',
    authority: 'Karnataka Medical Council',
    specialty: 'Orthopedics',
    npiBase: '177120934',
    dea: 'KR7120934',
    memberId: '',
    practice: 'Manipal Hospital, Bengaluru',
    malpractice:
      'One claim filed in 2019 over a delayed diagnosis; dismissed by the court in 2020.',
  },
  veteran: {
    legalName: 'Priya Nair',
    birthDate: '1976-09-08',
    nationality: 'India',
    passport: 'L5520981',
    school: 'Christian Medical College, Vellore',
    graduationYear: 2000,
    license: 'TN-2000-09811',
    authority: 'Tamil Nadu Medical Council',
    specialty: 'Neurology',
    npiBase: '155209812',
    dea: 'PN5209812',
    memberId: 'IAN09811',
    practice: 'Apollo Hospitals, Chennai',
  },
}

/** Seed data with dates relative to `now`, so every scenario in CONTEXT.md §10 is always demoable. */
export const buildSeed = (now: Date): { users: User[]; forms: FormsTable } => {
  const freshCert = subMonths(now, 2)
  const fourYearCert = subYears(now, 4)
  const sevenYearCert = subYears(now, 7)
  const tenYearCert = subYears(now, 10)

  const users: User[] = [
    makeUser({
      id: 'u-admin',
      name: 'Portal Admin',
      username: 'admin',
      password: 'Admin@123',
      type: 'admin',
      createdAt: subYears(now, 8),
    }),
    makeUser({
      id: 'u-cand-new',
      name: 'Dr. Ananya Mehta',
      username: 'cand.new',
      password: 'Pass@123',
      type: 'candidate',
      createdAt: subMonths(now, 1),
    }),
    makeUser({
      id: 'u-cand-partial',
      name: 'Dr. Rohan Kulkarni',
      username: 'cand.partial',
      password: 'Pass@123',
      type: 'candidate',
      createdAt: subMonths(now, 5),
    }),
    makeUser({
      id: 'u-cand-ready',
      name: 'Dr. Sara Fernandes',
      username: 'cand.ready',
      password: 'Pass@123',
      type: 'candidate',
      createdAt: subMonths(now, 3),
    }),
    makeUser({
      id: 'u-dip-fresh',
      name: 'Dr. Vikram Shah',
      username: 'dip.fresh',
      password: 'Pass@123',
      type: 'diplomat',
      createdAt: subMonths(now, 4),
      certifiedAt: freshCert,
    }),
    makeUser({
      id: 'u-dip-ontrack',
      name: 'Dr. Meera Iyer',
      username: 'dip.ontrack',
      password: 'Pass@123',
      type: 'diplomat',
      createdAt: subMonths(fourYearCert, 2),
      certifiedAt: fourYearCert,
    }),
    makeUser({
      id: 'u-dip-overdue',
      name: 'Dr. Karan Rao',
      username: 'dip.overdue',
      password: 'Pass@123',
      type: 'diplomat',
      createdAt: subMonths(sevenYearCert, 3),
      certifiedAt: sevenYearCert,
    }),
    makeUser({
      id: 'u-dip-veteran',
      name: 'Dr. Priya Nair',
      username: 'dip.veteran',
      password: 'Pass@123',
      type: 'diplomat',
      createdAt: subMonths(tenYearCert, 2),
      certifiedAt: tenYearCert,
    }),
  ]

  const { partial, ready, fresh, ontrack, overdue, veteran } = PROFILES

  // Cycle 1 is the Initial Certification: submitted on certifiedAt.
  const forms: FormsTable = {
    'u-cand-partial': { 'cycle-1': makeForm('cycle-1', partial, 2, subMonths(now, 4)) },
    'u-cand-ready': { 'cycle-1': makeForm('cycle-1', ready, 3, subMonths(now, 3)) },
    // Cycle 1 done 2 months ago; Cycle 2 opens in ~3 years.
    'u-dip-fresh': { 'cycle-1': makeForm('cycle-1', fresh, 4, subMonths(now, 4), freshCert) },
    // In Cycle 2 (started a year ago) with 2/4 saved.
    'u-dip-ontrack': {
      'cycle-1': makeForm('cycle-1', ontrack, 4, subMonths(fourYearCert, 2), fourYearCert),
      'cycle-2': makeForm('cycle-2', ontrack, 2, addYears(fourYearCert, 3)),
    },
    // Cycle 2 ended a year ago at 2/4 (overdue); now in Cycle 3 at 0/4.
    'u-dip-overdue': {
      'cycle-1': makeForm('cycle-1', overdue, 4, subMonths(sevenYearCert, 3), sevenYearCert),
      'cycle-2': makeForm('cycle-2', overdue, 2, addYears(sevenYearCert, 4)),
    },
    // Cycles 1–3 submitted; now in Cycle 4 at 1/4.
    'u-dip-veteran': {
      'cycle-1': makeForm('cycle-1', veteran, 4, subMonths(tenYearCert, 2), tenYearCert),
      'cycle-2': makeForm(
        'cycle-2',
        veteran,
        4,
        addYears(tenYearCert, 4),
        addYears(tenYearCert, 5),
      ),
      'cycle-3': makeForm(
        'cycle-3',
        veteran,
        4,
        addYears(tenYearCert, 7),
        addYears(tenYearCert, 8),
      ),
      'cycle-4': makeForm('cycle-4', veteran, 1, addYears(tenYearCert, 9)),
    },
  }

  return { users, forms }
}
