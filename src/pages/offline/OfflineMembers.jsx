import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflineMembers() {
  const { params, goBack, previousRouteLabel, goJourney } = useNavigation()
  const journeyId = params.journeyId
  const { getPack } = useOffline()
  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const next = journeyId ? await getPack(journeyId) : null
      if (mounted) {
        setPack(next)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [journeyId, getPack])

  const people = useMemo(() => pack?.people ?? [], [pack])

  const backLeading = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        previousRouteLabel ? goBack() : goJourney(journeyId)
      }
    >
      <ArrowLeft size={14} aria-hidden="true" />
      {previousRouteLabel ?? 'Journey'}
    </Button>
  )

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Travelers" leading={backLeading} />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="Travelers" leading={backLeading} />
        <div className={cx('is-fluid-width', styles.body)}>
          <div className={styles.empty}>
            <p className={styles.error}>Not available offline.</p>
            <Button
              onClick={() =>
                previousRouteLabel ? goBack() : goJourney(journeyId)
              }
              fullWidth
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Travelers"
        subtitle={pack.journey?.title}
        leading={backLeading}
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner syncedAt={pack.syncedAt} />
        {people.length === 0 ? (
          <p className={styles.hint}>No travelers in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {people.map((p) => (
              <li key={p.id} className={styles.entryRow}>
                <div className={styles.entryMain}>
                  <strong>{p.displayName || 'Traveler'}</strong>
                  {p.email && <span className={styles.hint}>{p.email}</span>}
                  {p.phoneE164 && (
                    <span className={styles.hint}>{p.phoneE164}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
