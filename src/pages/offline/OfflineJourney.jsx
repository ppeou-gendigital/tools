import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckSquare,
  ListMusic,
  MapPin,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { formatWallDate, formatWallTime } from '@/lib/format'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflineJourney() {
  const { params, goHome, navigate } = useNavigation()
  const journeyId = params.journeyId
  const { getPack } = useOffline()
  const { displayLocale } = useDisplayPrefs()
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

  const entries = useMemo(() => {
    const list = pack?.entries ?? []
    return [...list].sort((a, b) => {
      const da = a.occursOn || a.occursAt || ''
      const db = b.occursOn || b.occursAt || ''
      return String(da).localeCompare(String(db))
    })
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Journey" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading offline journey…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack?.journey) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Journey"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} aria-hidden="true" />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>This journey is not available offline.</p>
          <Button onClick={goHome} fullWidth>
            Back
          </Button>
        </div>
      </div>
    )
  }

  const journey = pack.journey
  const tz = journey.defaultTimezone

  return (
    <div className={styles.page}>
      <PageHeader
        title={journey.title || 'Journey'}
        leading={
          <Button variant="ghost" size="sm" onClick={goHome}>
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner syncedAt={pack.syncedAt} />

        <div className={styles.chipRow}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('spending', { journeyId })}
          >
            <Wallet size={14} aria-hidden="true" />
            Spending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('todos', { journeyId })}
          >
            <CheckSquare size={14} aria-hidden="true" />
            To-dos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('playlist', { journeyId })}
          >
            <ListMusic size={14} aria-hidden="true" />
            Playlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('map', { journeyId })}
          >
            <MapPin size={14} aria-hidden="true" />
            Places
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('members', { journeyId })}
          >
            <Users size={14} aria-hidden="true" />
            Travelers
          </Button>
        </div>

        <p className={styles.sectionTitle}>Timeline</p>
        {entries.length === 0 ? (
          <p className={styles.hint}>No activities in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {entries.map((e) => {
              const when = e.occursAt
                ? `${formatWallDate(e.occursAt, e.timezone || tz, displayLocale)} · ${formatWallTime(e.occursAt, e.timezone || tz, displayLocale)}`
                : e.occursOn
                  ? formatWallDate(e.occursOn, tz, displayLocale)
                  : null
              return (
                <li key={e.id} className={styles.entryRow}>
                  <div className={styles.entryMain}>
                    <strong>{e.title || e.activityId || 'Activity'}</strong>
                    {when && <span className={styles.hint}>{when}</span>}
                    {e.placeName && (
                      <span className={styles.hint}>{e.placeName}</span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
