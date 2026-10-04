import { useState } from 'react'
import type { MenuItem } from '@/components/ui/Menu'
import type { StepperStep, StepStatus } from '@/components/ui/Stepper'
import type { TabItem } from '@/components/ui/Tabs'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useToast } from '@/hooks/useToast'

const STEP_LABELS = [
  'Personal & Identity',
  'Education & Licensure',
  'Board Certification',
  'Practice & Attestation',
]

export type CycleTab = 'all' | 'cycle-1' | 'cycle-2' | 'cycle-3'

export const CYCLE_TABS: TabItem<CycleTab>[] = [
  { value: 'all', label: 'All' },
  { value: 'cycle-1', label: 'Cycle 1 · Initial' },
  { value: 'cycle-2', label: 'Cycle 2', count: 1, alert: true },
  { value: 'cycle-3', label: 'Cycle 3' },
]

export const useOverlaySectionState = () => {
  const toast = useToast()
  const editModal = useDisclosure()
  const confirmDialog = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const [cycleTab, setCycleTab] = useState<CycleTab>('all')
  const [currentStep, setCurrentStep] = useState(2)

  const steps: StepperStep[] = STEP_LABELS.map((label, index) => {
    const status: StepStatus =
      index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
    return { label, status }
  })

  const confirmDelete = () => {
    setIsDeleting(true)
    window.setTimeout(() => {
      setIsDeleting(false)
      confirmDialog.close()
      toast.success('Dr. Karan Rao was deleted.')
    }, 900)
  }

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'View profile',
      icon: 'user',
      onSelect: () => toast.info('Profile opened.'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onSelect: () => toast.info('Settings opened.'),
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: 'logout',
      tone: 'danger',
      onSelect: () => toast.warning('You were logged out (demo).'),
    },
  ]

  return {
    toast,
    editModal,
    confirmDialog,
    isDeleting,
    confirmDelete,
    cycleTab,
    setCycleTab,
    steps,
    goToStep: setCurrentStep,
    nextStep: () => setCurrentStep((step) => Math.min(step + 1, STEP_LABELS.length - 1)),
    previousStep: () => setCurrentStep((step) => Math.max(step - 1, 0)),
    menuItems,
  }
}
