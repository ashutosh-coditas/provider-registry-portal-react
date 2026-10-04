import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LinkButton } from '@/components/ui/LinkButton'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { CycleCard } from '../components/CycleCard'
import styles from './DiplomatDashboard.module.scss'
import { useDiplomatDashboardState } from './DiplomatDashboard.state'

export const DiplomatDashboardPage = () => {
  const {
    name,
    isLoading,
    isError,
    refetch,
    subtitle,
    overdue,
    firstOverdueTo,
    tabs,
    filter,
    setFilter,
    visibleItems,
  } = useDiplomatDashboardState()

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Diplomat"
        title={`Welcome, ${name}`}
        meta={
          <Badge tone="success" icon="seal">
            Certified
          </Badge>
        }
        description={subtitle}
      />

      {overdue.length > 0 && firstOverdueTo && (
        <Alert
          tone="danger"
          title={`You have ${overdue.length} overdue certification${overdue.length > 1 ? 's' : ''}`}
          action={
            <LinkButton
              to={firstOverdueTo}
              size="sm"
              variant="dangerOutline"
              rightIcon="arrowRight"
            >
              Complete {overdue[0].title}
            </LinkButton>
          }
        >
          {overdue.map((item) => `${item.title} (${item.periodLabel})`).join(', ')} ended without
          being submitted. Complete {overdue.length > 1 ? 'them' : 'it'} along with your current
          cycle.
        </Alert>
      )}

      <section className={styles.certifications} aria-labelledby="certifications-title">
        <div className={styles.sectionHeader}>
          <h2 id="certifications-title" className={styles.sectionTitle}>
            Certifications
          </h2>
          {!isLoading && !isError && (
            <Tabs
              label="Filter by cycle"
              items={tabs}
              value={filter}
              onChange={setFilter}
              panelId="certification-cards"
              variant="pills"
            />
          )}
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" />
                <Skeleton height={8} />
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card>
            <EmptyState
              icon="warningCircle"
              tone="danger"
              title="We couldn’t load your certifications"
              action={
                <Button variant="secondary" onClick={refetch}>
                  Try again
                </Button>
              }
            />
          </Card>
        ) : (
          <div id="certification-cards" role="tabpanel" className={styles.grid}>
            {visibleItems.map((item) => (
              <CycleCard key={item.formKey} summary={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
