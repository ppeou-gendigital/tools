import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflineTodos() {
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

  const peopleById = useMemo(() => {
    const map = new Map()
    for (const p of pack?.people ?? []) map.set(p.id, p)
    return map
  }, [pack])

  const todos = useMemo(() => {
    const list = pack?.todos ?? []
    return [...list].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="To-dos" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="To-dos" />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Not available offline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="To-dos"
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
        {todos.length === 0 ? (
          <p className={styles.hint}>No to-dos in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {todos.map((t) => {
              const names = (t.assigneeJourneyPersonIds ?? [])
                .map((id) => peopleById.get(id)?.displayName)
                .filter(Boolean)
              return (
                <li key={t.id} className={styles.entryRow}>
                  <span className={styles.entryIcon} aria-hidden="true">
                    {t.done ? <Check size={16} /> : <Circle size={16} />}
                  </span>
                  <div className={styles.entryMain}>
                    <strong
                      style={{
                        textDecoration: t.done ? 'line-through' : undefined,
                        opacity: t.done ? 0.7 : 1,
                      }}
                    >
                      {t.title || 'To-do'}
                    </strong>
                    {t.notes && <span className={styles.hint}>{t.notes}</span>}
                    {names.length > 0 && (
                      <span className={styles.hint}>
                        {names.join(', ')}
                      </span>
                    )}
                    {t.dueOn && (
                      <span className={styles.hint}>Due {t.dueOn}</span>
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
