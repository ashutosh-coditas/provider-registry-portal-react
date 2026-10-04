import { Accordion } from '@/components/ui/Accordion'
import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DescriptionList } from '@/components/ui/DescriptionList'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { Table } from '@/components/ui/Table'
import { ShowcaseBlock, ShowcaseSection } from '../ShowcaseBlock'
import styles from './DisplaySection.module.scss'
import { SAMPLE_COLUMNS, useDisplaySectionState } from './DisplaySection.state'

export const DisplaySection = () => {
  const { rows, totalItems, pageSize, page, setPage, sort, setSort, isLoading, showLoading } =
    useDisplaySectionState()

  return (
    <ShowcaseSection
      id="display"
      title="Data display & feedback"
      description="Status is shown by shape and color together, so overdue, due and completed read at a glance."
    >
      <ShowcaseBlock
        title="Badge"
        usage="Roles, form status and counts. Use dot for live status."
        inline
      >
        <Badge tone="success" dot>
          Diplomat
        </Badge>
        <Badge tone="warning" dot>
          Candidate
        </Badge>
        <Badge>Admin</Badge>
        <Badge tone="success" icon="checkCircle">
          Completed
        </Badge>
        <Badge tone="warning" icon="clock">
          Due 2028-03-10
        </Badge>
        <Badge tone="danger" icon="warning">
          Overdue
        </Badge>
        <Badge tone="primary">In progress</Badge>
        <Badge tone="neutral" icon="lock">
          Upcoming
        </Badge>
        <Badge tone="info" size="sm">
          Simulated date
        </Badge>
      </ShowcaseBlock>

      <ShowcaseBlock title="Progress" usage="Completion out of 4 steps.">
        <ProgressBar label="Not started" value={0} max={4} showValue />
        <ProgressBar label="In progress" value={2} max={4} showValue />
        <ProgressBar label="Overdue" value={2} max={4} showValue tone="danger" />
        <ProgressBar label="Complete" value={4} max={4} showValue tone="success" />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Alert"
        usage="Page-level messages. Danger and warning interrupt screen readers."
      >
        <Alert
          tone="danger"
          title="You have 1 overdue certification"
          action={
            <Button size="sm" variant="dangerOutline">
              Complete Cycle 1
            </Button>
          }
        >
          Cycle 1 (2022–2025) ended on 2025-03-10 with 2 of 4 steps saved.
        </Alert>
        <Alert tone="warning" title="Simulated date: 2029-04-01">
          Cycle calculations use this date instead of today.
        </Alert>
        <Alert tone="success" title="Step 2 saved">
          You can leave and continue later.
        </Alert>
        <Alert tone="info" onDismiss={() => undefined}>
          Answers are pre-filled from your last submission. Review each step before saving.
        </Alert>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Card"
        usage="Groups related content. Tone marks state; dashed marks locked items."
      >
        <div className={styles.cardGrid}>
          <Card
            title="Cycle 1 · Initial Certification"
            description="2022–2025 · Submitted 2022-03-10"
            actions={
              <Badge tone="success" icon="checkCircle">
                Completed
              </Badge>
            }
            footer={
              <Button variant="ghost" size="sm" rightIcon="arrowRight">
                View
              </Button>
            }
          >
            <ProgressBar label="Initial" value={4} max={4} showValue tone="success" size="sm" />
          </Card>
          <Card
            tone="danger"
            title="Cycle 2 · 2025–2028"
            description="Ended 2028-03-10"
            actions={
              <Badge tone="danger" icon="warning">
                Overdue
              </Badge>
            }
            footer={
              <Button size="sm" rightIcon="arrowRight">
                Continue
              </Button>
            }
          >
            <ProgressBar label="Cycle 1" value={2} max={4} showValue tone="danger" size="sm" />
          </Card>
          <Card
            title="Cycle 2 · 2025–2028"
            description="892 days left"
            actions={
              <Badge tone="warning" icon="clock">
                Due 2028-03-10
              </Badge>
            }
            footer={
              <Button variant="outline" size="sm" rightIcon="arrowRight">
                Start
              </Button>
            }
          >
            <ProgressBar label="Cycle 2" value={0} max={4} showValue size="sm" />
          </Card>
          <Card
            dashed
            tone="muted"
            title="Cycle 3 · 2028–2031"
            description="Opens 2028-03-10"
            actions={<Badge icon="lock">Upcoming</Badge>}
          />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Table & pagination"
        usage="Sortable headers, row actions, skeleton loading, empty state."
      >
        <div className={styles.toolbar}>
          <Button size="sm" variant="secondary" leftIcon="clock" onClick={showLoading}>
            Show loading state
          </Button>
        </div>
        <Table
          caption="Example providers"
          columns={SAMPLE_COLUMNS}
          rows={rows}
          getRowKey={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
          isLoading={isLoading}
          loadingRows={4}
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
        <Table
          caption="Empty example"
          columns={SAMPLE_COLUMNS}
          rows={[]}
          getRowKey={(row) => row.id}
          emptyState={
            <EmptyState
              icon="users"
              title="No providers match your filters"
              description="Try a different name, or clear the filters."
              action={
                <Button variant="secondary" size="sm">
                  Clear filters
                </Button>
              }
            />
          }
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Description list & accordion"
        usage="Read-only answers and the step 4 review summary."
      >
        <Accordion
          defaultOpenIds={['step-1']}
          items={[
            {
              id: 'step-1',
              title: 'Step 1 · Personal & Identity',
              meta: (
                <Badge tone="success" size="sm">
                  Complete
                </Badge>
              ),
              content: (
                <DescriptionList
                  items={[
                    { label: 'Full legal name', value: 'Meera Iyer' },
                    { label: 'Date of birth', value: '1984-06-12' },
                    { label: 'Nationality', value: 'India' },
                    { label: 'Passport number', value: 'Z1234567' },
                    { label: 'Passport expiry date', value: '2031-02-01' },
                  ]}
                />
              ),
            },
            {
              id: 'step-2',
              title: 'Step 2 · Medical Education & Licensure',
              meta: (
                <Badge tone="primary" size="sm">
                  In progress
                </Badge>
              ),
              content: (
                <DescriptionList
                  items={[
                    { label: 'Medical school', value: 'AIIMS New Delhi' },
                    { label: 'Year of graduation', value: '2008' },
                    { label: 'License number', value: '' },
                  ]}
                />
              ),
            },
          ]}
        />
      </ShowcaseBlock>

      <ShowcaseBlock title="Empty state, avatar, loading" inline>
        <div className={styles.miniGrid}>
          <Card padding="none">
            <EmptyState
              icon="seal"
              tone="success"
              title="Certification submitted"
              description="You are now a Diplomat. Cycle 1 has begun."
            />
          </Card>
          <Card title="Avatars" padding="md">
            <div className={styles.row}>
              <Avatar name="Dr. Meera Iyer" size="sm" />
              <Avatar name="Dr. Karan Rao" />
              <Avatar name="Portal Admin" size="lg" />
            </div>
          </Card>
          <Card title="Loading" padding="md">
            <div className={styles.row}>
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
            </div>
            <Skeleton width="70%" />
            <Skeleton width="45%" />
            <Skeleton shape="rect" />
          </Card>
        </div>
      </ShowcaseBlock>
    </ShowcaseSection>
  )
}
