import { EmptyState } from '@/components/ui/EmptyState'
import { LinkButton } from '@/components/ui/LinkButton'
import styles from './NotFound.module.scss'
import { useNotFoundState } from './NotFound.state'

export const NotFoundPage = () => {
  const { homePath, homeLabel } = useNotFoundState()

  return (
    <div className={styles.page}>
      <EmptyState
        size="page"
        icon="file"
        title="Page not found"
        description="The page you opened doesn’t exist or has moved. Check the address, or go back to your dashboard."
        action={
          <LinkButton to={homePath} leftIcon="arrowLeft">
            {homeLabel}
          </LinkButton>
        }
      />
    </div>
  )
}
