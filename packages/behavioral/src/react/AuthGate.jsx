import { useAuth } from '@tools/service'

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} props.signIn
 * @param {import('react').ReactNode} [props.loadingFallback]
 * @param {(route: string) => import('react').ReactNode | null} [props.renderPreAuth]
 * @param {string} [props.route] — current route id for pre-auth routes
 */
export function AuthGate({
  children,
  signIn,
  loadingFallback,
  renderPreAuth,
  route,
}) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      loadingFallback ?? (
        <div className="bh-auth-loading" role="status">
          Loading…
        </div>
      )
    )
  }

  if (!session) {
    const pre = renderPreAuth?.(route)
    if (pre != null) return pre
    return signIn
  }

  return children
}
