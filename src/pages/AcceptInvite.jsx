import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SignInForm } from '@/blocks/SignInForm'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import {
  acceptInvite,
  labelForInviteRole,
  peekInvite,
} from '@/lib/invitesApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function AcceptInvite() {
  const { params, replace, goHome } = useNavigation()
  const { session } = useAuth()
  const token = params.inviteToken
  const [error, setError] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)
  const [now] = useState(() => Date.now())

  const { data: peek, isLoading, error: peekError } = useQuery({
    queryKey: ['toolname', 'peek-invite', token],
    queryFn: () => peekInvite(token),
    enabled: !!token,
  })

  const acceptMut = useMutation({
    mutationFn: () => acceptInvite(token),
    onSuccess: (member) => {
      replace('workspace', { workspaceId: member.workspaceId })
    },
    onError: (err) => setError(err.message || 'Could not join'),
  })

  if (!token) {
    return (
      <div className={styles.page}>
        <PageHeader title="Join workspace" />
        <div className={cx('is-fluid-width', styles.body)}>
          <div className={styles.empty}>
            <p className={styles.error}>Missing invite token.</p>
            <Button onClick={goHome}>Go home</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!session && showSignIn) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Join workspace"
          subtitle={peek?.workspaceTitle}
        />
        <div className={cx('is-fluid-width', styles.body)}>
          {peek?.workspaceTitle && (
            <div className={styles.block}>
              <span className={styles.rowTitle}>{peek.workspaceTitle}</span>
            </div>
          )}
          <SignInForm
            contextMessage={
              peek?.workspaceTitle
                ? `Sign in to join “${peek.workspaceTitle}”.`
                : 'Sign in to accept this invite.'
            }
            onBack={() => setShowSignIn(false)}
          />
        </div>
      </div>
    )
  }

  const expired =
    peek?.expiresAt != null && new Date(peek.expiresAt).getTime() <= now
  const blocked = !peek || peek.revoked || expired
  const roleLabel = peek ? labelForInviteRole(peek.role) : ''

  return (
    <div className={styles.page}>
      <PageHeader
        title="Join workspace"
        subtitle="You've been invited to collaborate."
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {isLoading && <LoadingState>Checking invite…</LoadingState>}
        {!isLoading && !peek && !peekError && (
          <div className={styles.empty}>
            <p className={styles.error}>Invite not found or no longer valid.</p>
            <Button onClick={goHome}>Go home</Button>
          </div>
        )}
        {peekError && (
          <div className={styles.empty}>
            <p className={styles.error} role="alert">
              Could not check this invite. ({peekError.message})
            </p>
            {!session && (
              <Button onClick={() => setShowSignIn(true)} fullWidth>
                Sign in to join
              </Button>
            )}
            <Button onClick={goHome}>Go home</Button>
          </div>
        )}
        {peek && (
          <>
            <div className={styles.block}>
              <span className={styles.rowTitle}>{peek.workspaceTitle}</span>
              <span className={styles.rowMeta}>
                Join as {roleLabel}
                {peek.expiresAt
                  ? ` · Invite expires ${new Date(peek.expiresAt).toLocaleDateString()}`
                  : ''}
              </span>
            </div>
            {peek.revoked && (
              <p className={styles.error}>This invite was revoked.</p>
            )}
            {expired && !peek.revoked && (
              <p className={styles.error}>This invite has expired.</p>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            {!session ? (
              <Button
                disabled={blocked}
                onClick={() => setShowSignIn(true)}
                fullWidth
              >
                Sign in to join
              </Button>
            ) : (
              <Button
                disabled={blocked || acceptMut.isPending}
                onClick={() => {
                  setError('')
                  acceptMut.mutate()
                }}
                fullWidth
              >
                {acceptMut.isPending ? 'Joining…' : 'Accept invite'}
              </Button>
            )}
          </>
        )}
        <Button variant="ghost" onClick={goHome}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
