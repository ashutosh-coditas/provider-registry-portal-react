import { CertificationStatusBadge } from '@/components/certification/CertificationStatusBadge'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useCycleCardState } from './CycleCard.state'
import type { CycleCardProps } from './CycleCard.types'

/** One certification (Initial or a cycle) on the diplomat dashboard. */
export const CycleCard = ({ summary }: CycleCardProps) => {
  const { title, description, tone, isUpcoming, progressTone, ctaLabel, ctaVariant, ctaTo } =
    useCycleCardState({ summary })

  return (
    <Card
      as="article"
      tone={tone}
      dashed={isUpcoming}
      title={title}
      description={description}
      actions={<CertificationStatusBadge summary={summary} size="sm" />}
      footer={
        summary.isAccessible ? (
          <LinkButton to={ctaTo} variant={ctaVariant} size="sm" rightIcon="arrowRight">
            {ctaLabel}
          </LinkButton>
        ) : undefined
      }
    >
      {!isUpcoming && (
        <ProgressBar
          label={`${title} progress`}
          value={summary.completion}
          max={4}
          showValue
          size="sm"
          tone={progressTone}
        />
      )}
    </Card>
  )
}
