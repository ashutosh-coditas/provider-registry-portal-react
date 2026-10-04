import type { ButtonVariant } from '@/components/ui/Button'
import type { CardTone } from '@/components/ui/Card'
import type { ProgressTone } from '@/components/ui/ProgressBar'
import { buildPath } from '@/router/paths'
import { formatDisplayDate } from '@/utils/dates'
import type { CycleCardProps } from './CycleCard.types'

export const useCycleCardState = ({ summary }: CycleCardProps) => {
  const { displayState, isReadOnly, completion, status } = summary
  const isOverdue = displayState === 'overdue'
  const isUpcoming = displayState === 'upcoming'
  const isDone = displayState === 'completed' || displayState === 'completedLate'

  const detail: Record<typeof displayState, string> = {
    notStarted: 'Not started',
    inProgress: `${completion} of 4 steps saved`,
    completed: `Submitted ${formatDisplayDate(summary.submittedAt)}`,
    completedLate: `Submitted ${formatDisplayDate(summary.submittedAt)} (after the cycle ended)`,
    due:
      summary.daysLeft === null
        ? ''
        : `${summary.daysLeft} day${summary.daysLeft === 1 ? '' : 's'} left`,
    overdue: `Ended ${formatDisplayDate(summary.endsAt)}`,
    upcoming: `Opens ${formatDisplayDate(summary.startsAt)}`,
  }

  const ctaVariant: ButtonVariant = isReadOnly ? 'ghost' : isOverdue ? 'primary' : 'outline'
  const tone: CardTone = isOverdue ? 'danger' : isUpcoming ? 'muted' : 'default'
  const progressTone: ProgressTone = isDone ? 'success' : isOverdue ? 'danger' : 'primary'

  return {
    // Cycle 1 is named as the Initial Certification; its dates go in the description.
    title: summary.name,
    description:
      summary.isInitial && summary.periodLabel
        ? `${summary.periodLabel} · ${detail[displayState]}`
        : detail[displayState],
    tone,
    isUpcoming,
    progressTone,
    ctaLabel: isReadOnly ? 'View answers' : status === 'not_started' ? 'Start' : 'Continue',
    ctaVariant,
    ctaTo: buildPath.diplomatForm(summary.formKey),
  }
}
