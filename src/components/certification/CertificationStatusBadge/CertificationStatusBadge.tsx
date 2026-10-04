import { Badge } from '@/components/ui/Badge'
import { getStatusBadge } from './CertificationStatusBadge.state'
import type { CertificationStatusBadgeProps } from './CertificationStatusBadge.types'

export const CertificationStatusBadge = ({
  summary,
  size = 'md',
}: CertificationStatusBadgeProps) => {
  const { tone, icon, label } = getStatusBadge(summary)
  return (
    <Badge tone={tone} icon={icon} size={size}>
      {label}
    </Badge>
  )
}
