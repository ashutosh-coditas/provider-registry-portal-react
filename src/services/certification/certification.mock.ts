import { parseISO } from 'date-fns'
import { NON_PREFILLED_QUESTIONS } from '@/constants/certification'
import { PROVIDER_ROLES } from '@/constants/roles'
import type {
  CertificationDetail,
  CertificationForm,
  CertificationOverview,
  FormKey,
  StepNumber,
  User,
  UserForms,
} from '@/types'
import {
  buildCertificationSummaries,
  countOverdue,
  getCycleNumberAt,
  INITIAL_FORM_KEY,
} from '@/utils/cycles'
import { toDateKey } from '@/utils/dates'
import { db } from '../mock/db'
import type { MockRequest, MockRoute } from '../mock/mock.types'
import { getNow, MockHttpError, ok, requireRole, toPublicUser } from '../mock/mock.utils'
import type {
  CompleteStepRequest,
  SaveDraftRequest,
  SubmitCertificationRequest,
  SubmitCertificationResponse,
} from './certification.types'

interface Context {
  user: User
  now: Date
  forms: UserForms
}

const getContext = (request: MockRequest): Context => {
  const user = requireRole(request, PROVIDER_ROLES)
  return { user, now: getNow(), forms: db.forms.forUser(user.id) }
}

/** The summary for `formKey`, or 404 when the provider can't open it (other role, future cycle…). */
const getSummary = ({ user, forms, now }: Context, formKey: string) => {
  const summary = buildCertificationSummaries(user, forms, now).find(
    (item) => item.formKey === formKey && item.isAccessible,
  )
  if (!summary) throw new MockHttpError(404, 'This certification is not available.')
  return summary
}

const emptyForm = (formKey: FormKey): CertificationForm => ({
  formKey,
  status: 'not_started',
  currentStep: 1,
  completedSteps: [],
  answers: {},
  startedAt: null,
  updatedAt: null,
  submittedAt: null,
})

/** Most recent submitted form: the pre-fill source for a new cycle form. */
const getLatestSubmitted = (forms: UserForms) =>
  Object.values(forms)
    .filter((form): form is CertificationForm => form?.status === 'submitted')
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))[0]

/** Stored form, or a new one (cycle forms pre-filled from the latest submission). */
const getWorkingForm = ({ forms }: Context, formKey: FormKey) => {
  const stored = forms[formKey]
  if (stored) return { form: stored, prefilledFrom: null }

  const form = emptyForm(formKey)
  const source = formKey === INITIAL_FORM_KEY ? undefined : getLatestSubmitted(forms)
  if (!source) return { form, prefilledFrom: null }

  const answers = { ...source.answers }
  NON_PREFILLED_QUESTIONS.forEach((id) => delete answers[id])
  return { form: { ...form, answers }, prefilledFrom: source.formKey }
}

const buildDetail = (context: Context, formKey: FormKey): CertificationDetail => {
  const summary = getSummary(context, formKey)
  const { form, prefilledFrom } = getWorkingForm(context, formKey)
  return { summary, form, today: toDateKey(context.now), prefilledFrom }
}

/** Saves a form and returns the fresh detail (summary recomputed). */
const saveAndRespond = (request: MockRequest, form: CertificationForm) => {
  const context = getContext(request)
  db.forms.saveForUser(context.user.id, { ...context.forms, [form.formKey]: form })
  return buildDetail(getContext(request), form.formKey)
}

const getWritableForm = (request: MockRequest) => {
  const context = getContext(request)
  const formKey = request.params.formKey as FormKey
  const summary = getSummary(context, formKey)
  if (summary.isReadOnly) {
    throw new MockHttpError(409, 'This certification was already submitted and can’t be changed.')
  }
  const { form } = getWorkingForm(context, formKey)
  const timestamp = context.now.toISOString()
  return {
    context,
    form: {
      ...form,
      status: form.status === 'not_started' ? ('in_progress' as const) : form.status,
      startedAt: form.startedAt ?? timestamp,
      updatedAt: timestamp,
    },
  }
}

const sortSteps = (steps: StepNumber[]) => [...new Set(steps)].sort() as StepNumber[]

export const certificationMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/certifications',
    handler: (request) => {
      const { user, forms, now } = getContext(request)
      const items = buildCertificationSummaries(user, forms, now)
      const overview: CertificationOverview = {
        today: toDateKey(now),
        isSimulated: Boolean(db.settings.get().simulatedDate),
        userType: user.type,
        certifiedAt: user.certifiedAt,
        currentCycle: user.certifiedAt ? getCycleNumberAt(parseISO(user.certifiedAt), now) : null,
        overdueCount: countOverdue(items),
        items,
      }
      return ok(overview)
    },
  },
  {
    method: 'GET',
    path: '/certifications/:formKey',
    handler: (request) => ok(buildDetail(getContext(request), request.params.formKey as FormKey)),
  },
  {
    method: 'PUT',
    path: '/certifications/:formKey/draft',
    handler: (request) => {
      const { form } = getWritableForm(request)
      const { currentStep, answers, invalidateStep } = request.body as Omit<
        SaveDraftRequest,
        'formKey'
      >
      return ok(
        saveAndRespond(request, {
          ...form,
          currentStep,
          answers: { ...form.answers, ...answers },
          completedSteps: form.completedSteps.filter((step) => step !== invalidateStep),
        }),
      )
    },
  },
  {
    method: 'POST',
    path: '/certifications/:formKey/steps/:step',
    handler: (request) => {
      const step = Number(request.params.step) as StepNumber
      if (![1, 2, 3].includes(step)) {
        throw new MockHttpError(400, 'Step 4 is completed by submitting the certification.')
      }
      const { form } = getWritableForm(request)
      const { answers } = request.body as Pick<CompleteStepRequest, 'answers'>
      return ok(
        saveAndRespond(request, {
          ...form,
          currentStep: (step + 1) as StepNumber,
          answers: { ...form.answers, ...answers },
          completedSteps: sortSteps([...form.completedSteps, step]),
        }),
      )
    },
  },
  {
    method: 'POST',
    path: '/certifications/:formKey/submit',
    handler: (request) => {
      const { context, form } = getWritableForm(request)
      const missing = ([1, 2, 3] as const).filter((step) => !form.completedSteps.includes(step))
      if (missing.length > 0) {
        throw new MockHttpError(400, `Complete step ${missing.join(', ')} before submitting.`)
      }

      const { answers } = request.body as Pick<SubmitCertificationRequest, 'answers'>
      const submittedAt = context.now.toISOString()
      db.forms.saveForUser(context.user.id, {
        ...context.forms,
        [form.formKey]: {
          ...form,
          status: 'submitted',
          currentStep: 4,
          completedSteps: [1, 2, 3, 4],
          answers: { ...form.answers, ...answers },
          submittedAt,
        },
      })

      // Submitting Cycle 1 (the Initial Certification) turns a candidate into a diplomat;
      // Cycle 1's 3-year window starts now.
      let user = context.user
      if (form.formKey === INITIAL_FORM_KEY && user.type === 'candidate') {
        user = db.users.update(user.id, { type: 'diplomat', certifiedAt: submittedAt }) ?? user
      }

      const response: SubmitCertificationResponse = {
        user: toPublicUser(user),
        detail: buildDetail(getContext(request), form.formKey),
      }
      return ok(response)
    },
  },
]
