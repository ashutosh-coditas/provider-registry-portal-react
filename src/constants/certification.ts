import type { IconName } from '@/components/ui/Icon'
import type { QuestionId, StepNumber } from '@/types'

export type QuestionType = 'text' | 'date' | 'number' | 'select' | 'radio' | 'checkbox'

export interface QuestionOption {
  value: string
  label: string
}

export interface QuestionConfig {
  id: QuestionId
  number: number
  label: string
  type: QuestionType
  hint?: string
  placeholder?: string
  optional?: boolean
  options?: QuestionOption[]
  /** Uppercase input as the user types (passport, DEA, certificate numbers). */
  uppercase?: boolean
  maxLength?: number
  inputMode?: 'numeric' | 'text'
  /** Spans both columns of the form grid. */
  fullWidth?: boolean
}

export interface StepConfig {
  step: StepNumber
  title: string
  shortTitle: string
  description: string
  icon: IconName
  questions: QuestionConfig[]
}

export const SPECIALTIES = [
  'Anesthesiology',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'General Surgery',
  'Internal Medicine',
  'Neurology',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Dentistry',
  'Other',
] as const

const COUNTRY_CODES =
  'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

/** Country names (stored as the name, so answers read well everywhere). */
export const COUNTRIES: string[] = COUNTRY_CODES.split(' ')
  .map((code) => regionNames.of(code) ?? code)
  .sort((a, b) => a.localeCompare(b))

const toOptions = (values: readonly string[]): QuestionOption[] =>
  values.map((value) => ({ value, label: value }))

export const YES_NO_OPTIONS: QuestionOption[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
]

/** Minimum CME credits per certification. */
export const MIN_CME_CREDITS = 50

/** The certification questionnaire: same for the Initial Certification and every cycle. */
export const CERTIFICATION_STEPS: StepConfig[] = [
  {
    step: 1,
    title: 'Personal & Identity Details',
    shortTitle: 'Personal',
    description: 'Your legal identity, as shown on your passport.',
    icon: 'identity',
    questions: [
      { id: 'q1', number: 1, label: 'Full legal name', type: 'text', placeholder: 'Meera Iyer' },
      { id: 'q2', number: 2, label: 'Date of birth', type: 'date' },
      {
        id: 'q3',
        number: 3,
        label: 'Nationality',
        type: 'select',
        placeholder: 'Choose a country',
        options: toOptions(COUNTRIES),
      },
      {
        id: 'q4',
        number: 4,
        label: 'Passport number',
        type: 'text',
        placeholder: 'Z1234567',
        hint: '6–9 letters or digits',
        uppercase: true,
        maxLength: 9,
      },
      {
        id: 'q5',
        number: 5,
        label: 'Passport expiry date',
        type: 'date',
        hint: 'Must be valid for at least 6 more months',
      },
    ],
  },
  {
    step: 2,
    title: 'Medical Education & Licensure',
    shortTitle: 'Education',
    description: 'Where you trained and the license you practise under.',
    icon: 'education',
    questions: [
      {
        id: 'q6',
        number: 6,
        label: 'Medical school / university',
        type: 'text',
        placeholder: 'All India Institute of Medical Sciences',
        fullWidth: true,
      },
      {
        id: 'q7',
        number: 7,
        label: 'Year of graduation',
        type: 'number',
        placeholder: '2008',
        inputMode: 'numeric',
        maxLength: 4,
      },
      {
        id: 'q8',
        number: 8,
        label: 'Medical license number',
        type: 'text',
        placeholder: 'MH-2008-45123',
        hint: '5–20 letters, digits or hyphens',
        uppercase: true,
        maxLength: 20,
      },
      {
        id: 'q9',
        number: 9,
        label: 'Issuing licensing authority / state',
        type: 'text',
        placeholder: 'Maharashtra Medical Council',
      },
      {
        id: 'q10',
        number: 10,
        label: 'License expiry date',
        type: 'date',
        hint: 'An expired license cannot be submitted',
      },
    ],
  },
  {
    step: 3,
    title: 'Board Certification & Credentials',
    shortTitle: 'Board',
    description: 'Your specialty and professional identifiers.',
    icon: 'certificate',
    questions: [
      {
        id: 'q11',
        number: 11,
        label: 'Primary specialty',
        type: 'select',
        placeholder: 'Choose a specialty',
        options: toOptions(SPECIALTIES),
      },
      {
        id: 'q12',
        number: 12,
        label: 'Board certificate number',
        type: 'text',
        placeholder: 'BC-123456',
        hint: 'BC- followed by 6 digits',
        uppercase: true,
        maxLength: 9,
      },
      {
        id: 'q13',
        number: 13,
        label: 'NPI number',
        type: 'text',
        placeholder: '1234567893',
        hint: '10-digit National Provider Identifier',
        inputMode: 'numeric',
        maxLength: 10,
      },
      {
        id: 'q14',
        number: 14,
        label: 'DEA registration number',
        type: 'text',
        placeholder: 'AB1234567',
        hint: '2 letters followed by 7 digits',
        uppercase: true,
        maxLength: 9,
      },
      {
        id: 'q15',
        number: 15,
        label: 'ADA / professional association member ID',
        type: 'text',
        placeholder: 'ADA44871',
        optional: true,
        maxLength: 15,
      },
    ],
  },
  {
    step: 4,
    title: 'Practice, CME & Attestation',
    shortTitle: 'Practice',
    description: 'Where you practise now, your CME this cycle, and your attestation.',
    icon: 'briefcase',
    questions: [
      {
        id: 'q16',
        number: 16,
        label: 'Primary practice / hospital name',
        type: 'text',
        placeholder: 'Lilavati Hospital, Mumbai',
        fullWidth: true,
      },
      {
        id: 'q17',
        number: 17,
        label: 'Years in clinical practice',
        type: 'number',
        placeholder: '12',
        inputMode: 'numeric',
        maxLength: 2,
      },
      {
        id: 'q18',
        number: 18,
        label: 'CME credits earned this cycle',
        type: 'number',
        placeholder: '60',
        hint: `At least ${MIN_CME_CREDITS} credits are required`,
        inputMode: 'numeric',
        maxLength: 3,
      },
      {
        id: 'q19',
        number: 19,
        label: 'Any malpractice claims or disciplinary actions?',
        type: 'radio',
        options: YES_NO_OPTIONS,
        fullWidth: true,
      },
      {
        id: 'q20',
        number: 20,
        label: 'I attest that the information provided is true and complete.',
        type: 'checkbox',
        fullWidth: true,
      },
    ],
  },
]

export const TOTAL_STEPS = CERTIFICATION_STEPS.length

export const getStepConfig = (step: StepNumber) => CERTIFICATION_STEPS[step - 1]

/** Answers not carried into a new cycle form: they must be given again each cycle. */
export const NON_PREFILLED_QUESTIONS: QuestionId[] = ['q18', 'q20']

/** Every field id belonging to a step (Q19 includes its explanation). */
export const getStepFieldIds = (step: StepNumber): QuestionId[] => {
  const ids = getStepConfig(step).questions.map((question) => question.id)
  return step === 4 ? [...ids, 'q19Explanation'] : ids
}
