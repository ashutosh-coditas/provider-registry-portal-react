import type { Answers, CertificationDetail, FormKey, PublicUser, StepNumber } from '@/types'

export interface SaveDraftRequest {
  formKey: FormKey
  currentStep: StepNumber
  answers: Answers
  /** A completed step whose answers are no longer valid: it goes back to incomplete. */
  invalidateStep?: StepNumber
}

export interface CompleteStepRequest {
  formKey: FormKey
  step: StepNumber
  answers: Answers
}

export interface SubmitCertificationRequest {
  formKey: FormKey
  answers: Answers
}

export interface SubmitCertificationResponse {
  /** Updated user: a candidate comes back as a diplomat after Cycle 1 (Initial Certification). */
  user: PublicUser
  detail: CertificationDetail
}
