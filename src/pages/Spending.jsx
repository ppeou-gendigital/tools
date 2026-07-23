import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { formatMoney } from '@/lib/format'
import {
  getJourney,
  listExpensesForJourney,
  listJourneyPeople,
  listSplits,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function Spending() {
  const { params, goBack, previousRouteLabel, goExpenseEdit, goJourney } =
    useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const {
    data: expenses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['viaggio', 'expenses', journeyId],
    queryFn: () => listExpensesForJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: roster = [] } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const myPersonId = useMemo(
    () => roster.find((p) => p.linkedUserId === user?.id)?.id,
    [roster, user?.id],
  )

  const splitQueries = useQueries({
    queries: expenses.map((ex) => ({
      queryKey: ['viaggio', 'splits', ex.id],
      queryFn: () => listSplits(ex.id),
      enabled: !!ex.id,
    })),
  })

  const byCurrency = useMemo(() => {
    const map = new Map()
    expenses.forEach((ex, i) => {
      const splits = splitQueries[i]?.data || []
      const bucket = map.get(ex.currency) || {
        currency: ex.currency,
        total: 0,
        paid: 0,
        owed: 0,
        items: [],
      }
      bucket.total += ex.amountCents
      if (myPersonId && ex.paidBy === myPersonId) bucket.paid += ex.amountCents
      const mySplit = splits.find((s) => s.journeyPersonId === myPersonId)
      if (mySplit) bucket.owed += mySplit.amountCents
      bucket.items.push(ex)
      map.set(ex.currency, bucket)
    })
    return [...map.values()]
  }, [expenses, splitQueries, myPersonId])

  return (
    <div className={styles.page}>
      <PageHeader
        title="Spending"
        subtitle={journey?.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {isLoading && <LoadingState>Loading spending…</LoadingState>}
        {error && (
          <>
            <p className={styles.error}>
              Could not load expenses. ({error.message})
            </p>
            <Button variant="outline" onClick={() => refetch()} fullWidth>
              Retry
            </Button>
          </>
        )}
        {!isLoading && !error && expenses.length === 0 && (
          <div className={styles.empty}>
            <p>No expenses yet. Add them from an activity on the timeline.</p>
            <Button onClick={() => goJourney(journeyId)}>
              <Plus size={14} aria-hidden="true" />
              Back to journey
            </Button>
          </div>
        )}
        {byCurrency.map((bucket) => {
          const net = bucket.paid - bucket.owed
          return (
            <section key={bucket.currency} className={styles.form}>
              <p className={styles.sectionTitle}>{bucket.currency}</p>
              <div className={styles.block}>
                <span className={styles.rowTitle}>
                  Total{' '}
                  {formatMoney(bucket.total, bucket.currency, displayLocale)}
                </span>
                <span className={styles.rowMetaEmphasis}>
                  {net > 0
                    ? `You are owed ${formatMoney(net, bucket.currency, displayLocale)}`
                    : net < 0
                      ? `You owe ${formatMoney(-net, bucket.currency, displayLocale)}`
                      : 'Settled for you'}
                </span>
              </div>
              <ul className={styles.list}>
                {bucket.items.map((ex) => (
                  <li key={ex.id}>
                    <button
                      type="button"
                      className={styles.rowBtn}
                      onClick={() =>
                        goExpenseEdit({
                          journeyId,
                          entryId: ex.entryId,
                          expenseId: ex.id,
                        })
                      }
                    >
                      <span className={styles.rowBody}>
                        <span className={styles.rowTitle}>
                          {ex.title || 'Expense'}
                        </span>
                        <span className={styles.rowMeta}>
                          {formatMoney(
                            ex.amountCents,
                            ex.currency,
                            displayLocale,
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
