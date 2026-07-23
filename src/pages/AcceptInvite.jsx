import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { labelForRole } from '@/lib/catalog'
import { acceptInvite, peekInvite } from '@/lib/viaggioApi'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function AcceptInvite() {
  const { params, replace, goHome } = useNavigation()
  const token = params.inviteToken
  const [error, setError] = useState('')
  const [now] = useState(() => Date.now())

  const { data: peek, isLoading, error: peekError } = useQuery({
    queryKey: ['viaggio', 'peek-invite', token],
    queryFn: () => peekInvite(token),
    enabled: !!token,
  })

  const acceptMut = useMutation({
    mutationFn: () => acceptInvite(token),
    onSuccess: (member) => {
      replace('journey', { journeyId: member.journeyId })
    },
    onError: (err) => setError(err.message || 'Could not join'),
  })

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <div className={styles.empty}>
            <p className={styles.error}>Missing invite token.</p>
            <Button onClick={goHome}>Go home</Button>
          </div>
        </div>
      </div>
    )
  }

  const expired =
    peek?.expiresAt != null && new Date(peek.expiresAt).getTime() <= now
  const blocked = !peek || peek.revoked || expired

  return (
    <div className={styles.page}>
      <PageHeader
        title="Join journey"
        subtitle="You've been invited to collaborate."
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {isLoading && <LoadingState>Checking invite…</LoadingState>}
        {(peekError || (!isLoading && !peek)) && (
          <div className={styles.empty}>
            <p className={styles.error}>Invite not found or no longer valid.</p>
            <Button onClick={goHome}>Go home</Button>
          </div>
        )}
        {peek && (
          <>
            <div className={styles.block}>
              <span className={styles.rowTitle}>{peek.journeyTitle}</span>
              <span className={styles.rowMeta}>
                Join as {labelForRole({ type: 'trip' }, peek.role)}
              </span>
            </div>
            {peek.revoked && (
              <p className={styles.error}>This invite was revoked.</p>
            )}
            {expired && !peek.revoked && (
              <p className={styles.error}>This invite has expired.</p>
            )}
            {error && <p className={styles.error}>{error}</p>}
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
          </>
        )}
        <Button variant="ghost" onClick={goHome}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
