import type { AccordionItem } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DescriptionList, type DescriptionItem } from '@/components/ui/DescriptionList'
import { CERTIFICATION_STEPS, type QuestionConfig } from '@/constants/certification'
import type { AnswerValue, Answers } from '@/types'
import { formatDisplayDate, parseDateKey } from '@/utils/dates'
import styles from './CertificationReview.module.scss'
import type { CertificationReviewProps } from './CertificationReview.types'

/** Human-readable answer for the review and read-only views. */
const formatAnswer = (question: QuestionConfig, value: AnswerValue | undefined) => {
  if (value === undefined || value === '') return ''
  if (question.type === 'checkbox') return value ? 'Confirmed' : 'Not confirmed'
  if (question.type === 'radio') return value === 'yes' ? 'Yes' : 'No'
  if (question.type === 'date') {
    const date = parseDateKey(String(value))
    return date ? formatDisplayDate(date) : String(value)
  }
  return String(value)
}

const buildItems = (answers: Answers, questions: QuestionConfig[]): DescriptionItem[] =>
  questions.flatMap((question) => {
    const item: DescriptionItem = {
      label: `${question.number}. ${question.label}`,
      value: formatAnswer(question, answers[question.id]),
      fullWidth: question.fullWidth,
    }
    return question.id === 'q19' && answers.q19 === 'yes'
      ? [
          item,
          { label: 'Explanation', value: String(answers.q19Explanation ?? ''), fullWidth: true },
        ]
      : [item]
  })

export const useCertificationReviewState = ({
  answers,
  steps = [1, 2, 3, 4],
  completedSteps,
  onEditStep,
  expandAll = false,
}: CertificationReviewProps) => {
  const items: AccordionItem[] = CERTIFICATION_STEPS.filter((config) =>
    steps.includes(config.step),
  ).map((config) => ({
    id: `step-${config.step}`,
    title: `Step ${config.step} · ${config.title}`,
    meta: completedSteps ? (
      completedSteps.includes(config.step) ? (
        <Badge tone="success" size="sm" icon="check">
          Saved
        </Badge>
      ) : (
        <Badge tone="warning" size="sm">
          Not saved
        </Badge>
      )
    ) : undefined,
    content: (
      <div className={styles.content}>
        <DescriptionList items={buildItems(answers, config.questions)} />
        {onEditStep && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon="edit"
            className={styles.edit}
            onClick={() => onEditStep(config.step)}
          >
            Edit step {config.step}
          </Button>
        )}
      </div>
    ),
  }))

  return { items, defaultOpenIds: expandAll ? items.map((item) => item.id) : [] }
}
