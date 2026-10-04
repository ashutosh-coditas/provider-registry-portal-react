import { useGetCertificationQuery } from '@/services/certification'
import { INITIAL_FORM_KEY } from '@/utils/cycles'

export const useCandidateDashboardState = () => {
  const { data } = useGetCertificationQuery(INITIAL_FORM_KEY)
  return { formKey: INITIAL_FORM_KEY, completion: data?.summary.completion ?? 0 }
}
