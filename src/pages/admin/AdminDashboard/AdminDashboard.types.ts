import type { ProviderStatus } from '@/services/providers'

export type TypeFilter = 'all' | 'candidate' | 'diplomat'
export type StatusFilter = 'all' | ProviderStatus
export type ProviderSortKey = 'name' | 'completion' | 'cycle' | 'actions'
