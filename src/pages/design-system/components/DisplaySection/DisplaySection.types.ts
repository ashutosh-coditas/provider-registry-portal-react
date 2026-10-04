export type SampleSortKey = 'name' | 'completion'

export interface SampleProvider {
  id: string
  name: string
  username: string
  type: 'candidate' | 'diplomat'
  completion: number
  cycle: string | null
  overdue: number
}
