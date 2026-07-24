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

export function OfflinePlaces() {
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

  const places = useMemo(() => {
    const list = pack?.placeIdeas ?? []
    return [...list].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Places" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="Places" />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Not available offline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Places"
        leading={
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
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner syncedAt={pack.syncedAt} />
        <p className={styles.hint}>
          Place shortlist (read-only). Live map needs a network connection.
        </p>
        {places.length === 0 ? (
          <p className={styles.hint}>No places in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {places.map((p) => (
              <li key={p.id || p.googlePlaceId || p.name} className={styles.entryRow}>
                <div className={styles.entryMain}>
                  <strong>{p.name || 'Place'}</strong>
                  {p.address && (
                    <span className={styles.hint}>{p.address}</span>
                  )}
                  {p.note && <span className={styles.hint}>{p.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
