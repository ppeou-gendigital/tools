import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { formatMoney } from '@/lib/format'
import { convertCentsWithPackFx } from '@/lib/offline/journeyPack'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import { OfflineBanner } from './OfflineBanner'
import styles from '../Page.module.scss'

export function OfflineSpending() {
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

  const rows = useMemo(() => {
    const list = pack?.expenses ?? []
    return [...list].sort((a, b) =>
      String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id)),
    )
  }, [pack])

  const totalPreferred = useMemo(() => {
    if (!pack) return null
    let sum = 0
    let ok = true
    for (const ex of pack.expenses ?? []) {
      const conv = convertCentsWithPackFx(pack, ex.amountCents, ex.currency)
      if (conv.currency !== (pack.fx?.preferred || pack.journey?.defaultCurrency)) {
        ok = false
      }
      sum += conv.cents
    }
    return {
      cents: sum,
      currency: pack.fx?.preferred || pack.journey?.defaultCurrency,
      complete: ok,
    }
  }, [pack])

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Spending" />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading…</LoadingState>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className={styles.page}>
        <PageHeader title="Spending" />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Not available offline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Spending"
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
        {totalPreferred && (
          <p className={styles.hint}>
            Approx. total{' '}
            {formatMoney(
              totalPreferred.cents,
              totalPreferred.currency,
              displayLocale,
            )}
            {pack.fx?.asOf ? ` · FX as of ${pack.fx.asOf}` : ''}
            {!totalPreferred.complete ? ' (some rates missing)' : ''}
          </p>
        )}
        {rows.length === 0 ? (
          <p className={styles.hint}>No expenses in this offline copy.</p>
        ) : (
          <ul className={styles.list}>
            {rows.map((ex) => {
              const payer = peopleById.get(ex.paidBy)
              const conv = convertCentsWithPackFx(
                pack,
                ex.amountCents,
                ex.currency,
              )
              return (
                <li key={ex.id} className={styles.entryRow}>
                  <div className={styles.entryMain}>
                    <div className={styles.entryHeader}>
                      <strong>{ex.title || 'Expense'}</strong>
                      <span>
                        {formatMoney(
                          ex.amountCents,
                          ex.currency,
                          displayLocale,
                        )}
                      </span>
                    </div>
                    {conv.currency !== ex.currency && (
                      <span className={styles.hint}>
                        ≈{' '}
                        {formatMoney(
                          conv.cents,
                          conv.currency,
                          displayLocale,
                        )}
                      </span>
                    )}
                    {payer && (
                      <span className={styles.hint}>
                        Paid by {payer.displayName}
                      </span>
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
