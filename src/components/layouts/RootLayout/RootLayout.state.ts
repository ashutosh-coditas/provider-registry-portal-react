import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

export const useRootLayoutState = () => {
  const { isChecking } = useAuthBootstrap()
  return { isChecking }
}
