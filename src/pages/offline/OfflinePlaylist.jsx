import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflinePlaylist() {
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

  const items = useMemo(() => {
    const list = pack?.playlist ?? []
    return [...list].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Playlist" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="Playlist" />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Not available offline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Playlist"
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
          Links are listed for reference. Playback needs a network connection.
        </p>
        {items.length === 0 ? (
          <p className={styles.hint}>No playlist items in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id || `${item.url}-${item.sortOrder}`} className={styles.entryRow}>
                <div className={styles.entryMain}>
                  <div className={styles.entryHeader}>
                    <strong>{item.title || item.platform || 'Track'}</strong>
                    {item.platform && (
                      <span className={styles.hint}>{item.platform}</span>
                    )}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.hint}
                    >
                      <ExternalLink size={12} aria-hidden="true" /> Open link
                    </a>
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
