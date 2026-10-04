import type { BadgeTone } from '@/components/ui/Badge'
import type { IconName } from '@/components/ui/Icon'
import type { CertificationDisplayState } from '@/types'
import { formatDisplayDate } from '@/utils/dates'
import type { CertificationStatusBadgeProps } from './CertificationStatusBadge.types'

interface BadgeSpec {
  tone: BadgeTone
  icon: IconName
  label: string
}

/** Shape + color + text for each state, so status never relies on color alone. */
export const getStatusBadge = ({
  displayState,
  endsAt,
  completion,
}: CertificationStatusBadgeProps['summary']): BadgeSpec => {
  const specs: Record<CertificationDisplayState, BadgeSpec> = {
    notStarted: { tone: 'neutral', icon: 'clock', label: 'Not started' },
    inProgress: { tone: 'primary', icon: 'clock', label: `In progress · ${completion}/4` },
    completed: { tone: 'success', icon: 'checkCircle', label: 'Completed' },
    completedLate: { tone: 'success', icon: 'checkCircle', label: 'Completed late' },
    due: { tone: 'warning', icon: 'clock', label: `Due ${formatDisplayDate(endsAt)}` },
    overdue: { tone: 'danger', icon: 'warning', label: 'Overdue' },
    upcoming: { tone: 'neutral', icon: 'lock', label: 'Upcoming' },
  }
  return specs[displayState]
}
