import clsx from 'clsx'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { SearchField } from '@/components/ui/SearchField'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'
import { EditProviderModal } from '../components/EditProviderModal'
import styles from './AdminDashboard.module.scss'
import {
  PAGE_SIZE_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  useAdminDashboardState,
} from './AdminDashboard.state'
import type { StatusFilter, TypeFilter } from './AdminDashboard.types'

export const AdminDashboardPage = () => {
  const {
    isLoading,
    isError,
    refetch,
    stats,
    columns,
    rows,
    totalItems,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    hasFilters,
    clearFilters,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    editing,
    closeEdit,
    deleting,
    closeDelete,
    confirmDelete,
    isDeleting,
  } = useAdminDashboardState()

  return (
    <div className={styles.page}>
      <PageHeader
        title="Providers"
        description="Every registered provider with their current certification progress. Completion is for the cycle each provider is in now: Cycle 1 (the Initial Certification) for candidates, the current cycle for diplomats."
      />

      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={clsx(styles.stat, styles[stat.tone])}>
            <dt className={styles.statLabel}>{stat.label}</dt>
            <dd className={styles.statValue}>{isLoading ? '–' : stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.toolbar}>
        <SearchField
          label="Search providers"
          placeholder="Search name or username"
          value={search}
          onChange={setSearch}
          className={styles.search}
        />
        <div className={styles.filters}>
          <Select
            label="Type"
            hideLabel
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
          />
          <Select
            label="Status"
            hideLabel
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          />
        </div>
      </div>

      <Table
        caption="Providers"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        isLoading={isLoading}
        emptyState={
          isError ? (
            <EmptyState
              icon="warningCircle"
              tone="danger"
              title="We couldn’t load providers"
              action={
                <Button variant="secondary" onClick={refetch}>
                  Try again
                </Button>
              }
            />
          ) : hasFilters ? (
            <EmptyState
              icon="search"
              title="No providers match your filters"
              description="Try a different name, or clear the filters."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon="users"
              title="No providers yet"
              description="Providers appear here once they register."
            />
          )
        }
      />

      {totalItems > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={setPageSize}
        />
      )}

      {editing && <EditProviderModal provider={editing} onClose={closeEdit} />}

      <ConfirmDialog
        open={deleting !== null}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        tone="danger"
        title={`Delete ${deleting?.name ?? 'provider'}?`}
        confirmLabel="Delete provider"
      >
        This removes the provider and all their certification data.{' '}
        <strong>This cannot be undone.</strong>
      </ConfirmDialog>
    </div>
  )
}
