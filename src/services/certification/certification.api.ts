import type { CertificationDetail, CertificationOverview, FormKey } from '@/types'
import { baseApi } from '../api/baseApi'
import type {
  CompleteStepRequest,
  SaveDraftRequest,
  SubmitCertificationRequest,
  SubmitCertificationResponse,
} from './certification.types'

export const certificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCertificationOverview: build.query<CertificationOverview, void>({
      query: () => ({ url: '/certifications' }),
      providesTags: ['Certifications'],
    }),
    getCertification: build.query<CertificationDetail, FormKey>({
      query: (formKey) => ({ url: `/certifications/${formKey}` }),
      providesTags: (_result, _error, formKey) => [{ type: 'Certification', id: formKey }],
    }),

    // Auto-save: writes the response straight into the cache instead of refetching.
    saveDraft: build.mutation<CertificationDetail, SaveDraftRequest>({
      query: ({ formKey, ...body }) => ({
        url: `/certifications/${formKey}/draft`,
        method: 'PUT',
        data: body,
      }),
      onQueryStarted: async ({ formKey }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled.catch(() => ({ data: null }))
        if (data) dispatch(certificationApi.util.upsertQueryData('getCertification', formKey, data))
      },
    }),
    completeStep: build.mutation<CertificationDetail, CompleteStepRequest>({
      query: ({ formKey, step, answers }) => ({
        url: `/certifications/${formKey}/steps/${step}`,
        method: 'POST',
        data: { answers },
      }),
      onQueryStarted: async ({ formKey }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled.catch(() => ({ data: null }))
        if (data) dispatch(certificationApi.util.upsertQueryData('getCertification', formKey, data))
      },
      invalidatesTags: ['Certifications'],
    }),
    submitCertification: build.mutation<SubmitCertificationResponse, SubmitCertificationRequest>({
      query: ({ formKey, answers }) => ({
        url: `/certifications/${formKey}/submit`,
        method: 'POST',
        data: { answers },
      }),
      // The caller writes `detail` into the getCertification cache synchronously (before
      // navigating to the success page), so only the overview is refetched here.
      invalidatesTags: ['Certifications', 'Providers'],
    }),
  }),
})

export const {
  useGetCertificationOverviewQuery,
  useGetCertificationQuery,
  useSaveDraftMutation,
  useCompleteStepMutation,
  useSubmitCertificationMutation,
} = certificationApi
