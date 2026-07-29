import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { formatWallDate } from '@/lib/format'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflineTodos() {
  const { params, goBack, previousRouteLabel, goJourney } = useNavigation()
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

  const openCount = todos.filter((t) => !t.done).length
  const doneCount = todos.filter((t) => t.done).length
  const countLabel =
    todos.length > 0 ? `${openCount} open · ${doneCount} done` : null
  const journeyTitle = pack?.journey?.title
  const subtitle = [journeyTitle, countLabel].filter(Boolean).join(' · ')

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
        <PageHeader title="To-dos" leading={backLeading} />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="To-dos" leading={backLeading} />
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
        title="To-dos"
        subtitle={subtitle || undefined}
        leading={backLeading}
      />
      <div className={cx('is-fluid-width', styles.body)}>
        <OfflineBanner syncedAt={pack.syncedAt} />
        <p className={styles.readOnlyBanner}>
          Offline copy — changes sync when you’re back online.
        </p>
        {todos.length === 0 ? (
          <p className={styles.hint}>No to-dos in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {todos.map((t) => {
              const names = (t.assigneeJourneyPersonIds ?? [])
                .map((id) => peopleById.get(id)?.displayName)
                .filter(Boolean)
              const dueLabel = t.dueOn
                ? formatWallDate(t.dueOn, null, displayLocale)
                : ''
              return (
                <li key={t.id} className={styles.entryRow}>
                  <span
                    className={styles.hint}
                    style={{
                      flexShrink: 0,
                      width: '1.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.55,
                      fontSize: '0.75rem',
                      lineHeight: 1,
                    }}
                    aria-label={t.done ? 'Done' : 'Open'}
                  >
                    {t.done ? '✓' : '○'}
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
                    {dueLabel && (
                      <span className={styles.hint}>Due {dueLabel}</span>
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
