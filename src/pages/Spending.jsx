import { useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ListMusic,
  MapPin,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { LoadingState } from '@/molecules/LoadingState'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { activityIcon } from '@/lib/activityIcons'
import { getActivity, guessDeviceCurrency } from '@/lib/catalog'
import {
  formatMoney,
  formatRelativeDay,
  labelForJourneyPerson,
} from '@/lib/format'
import { convertCents, fetchRatesToPreferred } from '@/lib/fxRates'
import {
  getJourney,
  listEntries,
  listExpensesForJourney,
  listJourneyPeople,
  listSplits,
  myMembership,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

function netToneClass(net, styles) {
  if (net > 0) return styles.spendNetOwed
  if (net < 0) return styles.spendNetOwe
  return styles.spendNetSettled
}

function netLabel(net, currency, displayLocale) {
  if (net > 0) {
    return `Owed ${formatMoney(net, currency, displayLocale)}`
  }
  if (net < 0) {
    return `Owes ${formatMoney(-net, currency, displayLocale)}`
  }
  return 'Settled'
}

/** Prefer activity time for sort/meta; fall back to updated/created. */
function entryActivityMs(entry) {
  if (entry?.occursAt) {
    const t = new Date(entry.occursAt).getTime()
    if (!Number.isNaN(t)) return t
  }
  if (entry?.occursOn) {
    const t = new Date(`${entry.occursOn}T00:00:00`).getTime()
    if (!Number.isNaN(t)) return t
  }
  if (entry?.updatedAt) {
    const t = new Date(entry.updatedAt).getTime()
    if (!Number.isNaN(t)) return t
  }
  if (entry?.createdAt) {
    const t = new Date(entry.createdAt).getTime()
    if (!Number.isNaN(t)) return t
  }
  return 0
}

function entryActivityIso(entry) {
  return entry?.occursAt || entry?.occursOn || entry?.createdAt || null
}

export function Spending() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goExpenseEdit,
    goJourney,
    goMembers,
    goPlaylist,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale, defaultCurrency } = useDisplayPrefs()
  const [addOpen, setAddOpen] = useState(false)
  const [activityQuery, setActivityQuery] = useState('')
  const [view, setView] = useState('mine')

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

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

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['viaggio', 'entries', journeyId],
    queryFn: () => listEntries(journeyId),
    enabled: !!journeyId,
  })

  const preferredCurrency =
    defaultCurrency ||
    journey?.defaultCurrency ||
    guessDeviceCurrency() ||
    'USD'

  const entryById = useMemo(() => {
    const map = new Map()
    for (const entry of entries) map.set(entry.id, entry)
    return map
  }, [entries])

  const myPersonId = useMemo(
    () => roster.find((p) => p.linkedUserId === user?.id)?.id,
    [roster, user?.id],
  )

  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tb - ta
      }),
    [expenses],
  )

  const splitQueries = useQueries({
    queries: sortedExpenses.map((ex) => ({
      queryKey: ['viaggio', 'splits', ex.id],
      queryFn: () => listSplits(ex.id),
      enabled: !!ex.id,
    })),
  })

  const splitsReady =
    sortedExpenses.length === 0 ||
    splitQueries.every((q) => q.isSuccess || q.isError)

  const splitsByExpenseId = useMemo(() => {
    const map = new Map()
    sortedExpenses.forEach((ex, i) => {
      map.set(ex.id, splitQueries[i]?.data || [])
    })
    return map
  }, [sortedExpenses, splitQueries])

  const visibleExpenses = useMemo(() => {
    if (view === 'journey') return sortedExpenses
    if (!myPersonId) return []
    // Wait for splits so we don't treat “no data yet” as “not on the bill”.
    if (!splitsReady) return []
    return sortedExpenses.filter((ex) => {
      if (ex.paidBy === myPersonId) return true
      const splits = splitsByExpenseId.get(ex.id) || []
      return splits.some(
        (s) =>
          s.journeyPersonId === myPersonId && Number(s.amountCents) > 0,
      )
    })
  }, [
    view,
    sortedExpenses,
    myPersonId,
    splitsByExpenseId,
    splitsReady,
  ])

  const byCurrency = useMemo(() => {
    const map = new Map()
    visibleExpenses.forEach((ex) => {
      const splits = splitsByExpenseId.get(ex.id) || []
      const bucket = map.get(ex.currency) || {
        currency: ex.currency,
        total: 0,
        count: 0,
        items: [],
        people: new Map(),
      }

      bucket.total += ex.amountCents
      bucket.count += 1
      bucket.items.push(ex)

      const ensurePerson = (personId) => {
        if (!personId) return null
        if (!bucket.people.has(personId)) {
          bucket.people.set(personId, {
            personId,
            paid: 0,
            share: 0,
          })
        }
        return bucket.people.get(personId)
      }

      if (ex.paidBy) {
        const payer = ensurePerson(ex.paidBy)
        if (payer) payer.paid += ex.amountCents
      }
      for (const split of splits) {
        const row = ensurePerson(split.journeyPersonId)
        if (row) row.share += split.amountCents
      }

      if (view === 'journey') {
        for (const person of roster) {
          ensurePerson(person.id)
        }
      } else if (myPersonId) {
        ensurePerson(myPersonId)
      }

      map.set(ex.currency, bucket)
    })

    return [...map.values()].map((bucket) => {
      let people = [...bucket.people.values()]
        .map((row) => {
          const person = roster.find((p) => p.id === row.personId)
          const net = row.paid - row.share
          const isYou = row.personId === myPersonId
          return {
            ...row,
            net,
            isYou,
            label: person
              ? labelForJourneyPerson(person, user?.id)
              : 'Traveler',
          }
        })
        .sort((a, b) => {
          if (a.isYou !== b.isYou) return a.isYou ? -1 : 1
          return a.label.localeCompare(b.label)
        })
      if (view === 'mine') {
        people = people.filter((p) => p.isYou || p.personId === myPersonId)
      }
      return { ...bucket, people }
    })
  }, [
    visibleExpenses,
    splitsByExpenseId,
    roster,
    myPersonId,
    user?.id,
    view,
  ])

  /** Personal share by activity type (always the signed-in traveler). */
  const myActivitySpend = useMemo(() => {
    if (!myPersonId || !splitsReady) return []
    const groups = new Map()
    for (const ex of sortedExpenses) {
      const splits = splitsByExpenseId.get(ex.id) || []
      const mySplit = splits.find((s) => s.journeyPersonId === myPersonId)
      const shareCents =
        mySplit && Number(mySplit.amountCents) > 0
          ? Number(mySplit.amountCents)
          : ex.paidBy === myPersonId && splits.length === 0
            ? Number(ex.amountCents) || 0
            : 0
      if (shareCents <= 0) continue

      const entry = entryById.get(ex.entryId)
      const activityId = entry?.activityId || null
      const activity = activityId ? getActivity(activityId) : null
      const typeKey = activity?.id || ex.category || 'other'
      const label =
        activity?.label ||
        (ex.category
          ? ex.category.charAt(0).toUpperCase() + ex.category.slice(1)
          : 'Other')

      const group = groups.get(typeKey) || {
        typeKey,
        activityId,
        label,
        count: 0,
        byCurrency: new Map(),
      }
      group.count += 1
      group.byCurrency.set(
        ex.currency,
        (group.byCurrency.get(ex.currency) || 0) + shareCents,
      )
      groups.set(typeKey, group)
    }

    return [...groups.values()]
      .map((g) => ({
        ...g,
        originals: [...g.byCurrency.entries()]
          .map(([currency, cents]) => ({ currency, cents }))
          .sort((a, b) => a.currency.localeCompare(b.currency)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [
    myPersonId,
    splitsReady,
    sortedExpenses,
    splitsByExpenseId,
    entryById,
  ])

  const activityCurrencies = useMemo(
    () => [
      ...new Set(
        myActivitySpend.flatMap((g) => g.originals.map((o) => o.currency)),
      ),
    ],
    [myActivitySpend],
  )

  const { data: fx = { preferred: preferredCurrency, toPreferred: {} } } =
    useQuery({
      queryKey: ['fx', preferredCurrency, activityCurrencies.join(',')],
      queryFn: () =>
        fetchRatesToPreferred(preferredCurrency, activityCurrencies),
      enabled: activityCurrencies.length > 0 && !!preferredCurrency,
      staleTime: 1000 * 60 * 30,
    })

  const activityRows = useMemo(() => {
    return myActivitySpend.map((g) => {
      let preferredCents = 0
      let preferredReady = true
      for (const { currency, cents } of g.originals) {
        const conv = convertCents(
          cents,
          currency,
          fx.preferred || preferredCurrency,
          fx.toPreferred,
        )
        if (conv == null) preferredReady = false
        else preferredCents += conv
      }
      return {
        ...g,
        preferredCents,
        preferredReady,
        preferredCurrency: fx.preferred || preferredCurrency,
      }
    })
  }, [myActivitySpend, fx, preferredCurrency])

  const entryChoices = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => entryActivityMs(b) - entryActivityMs(a),
    )
    const q = activityQuery.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((entry) => {
      const label = getActivity(entry.activityId)?.label || entry.activityId || ''
      const haystack = [entry.title, label, entry.placeName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [entries, activityQuery])

  const paidByLabel = (ex) => {
    const person = roster.find((p) => p.id === ex.paidBy)
    if (!person) return null
    if (person.linkedUserId === user?.id) return 'You paid'
    return `Paid by ${person.displayName || 'traveler'}`
  }

  const openAdd = () => {
    setActivityQuery('')
    setAddOpen(true)
  }
  const closeAdd = () => {
    setAddOpen(false)
    setActivityQuery('')
  }

  const pickEntry = (entryId) => {
    closeAdd()
    goExpenseEdit({ journeyId, entryId })
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Spending"
        subtitle={journey?.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit ? (
            <div className={styles.toolbar}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={openAdd}
                aria-label="Add expense"
                title="Add expense"
              >
                <Plus size={14} aria-hidden="true" />
              </Button>
            </div>
          ) : null
        }
        shortcuts={
          <PageShortcuts
            current="spending"
            className={styles.iconBtn}
            shortcuts={[
              {
                id: 'members',
                label: 'Travelers',
                icon: Users,
                pick: () => () => goMembers(journeyId),
              },
              {
                id: 'playlist',
                label: 'Playlist',
                icon: ListMusic,
                pick: () => () => goPlaylist(journeyId),
              },
              {
                id: 'map',
                label: 'Map',
                icon: MapPin,
                pick: () => () => goMap(journeyId),
              },
              {
                id: 'journey-settings',
                label: 'Settings',
                icon: Settings,
                pick: () => () => goJourneySettings(journeyId),
              },
            ]}
          />
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {!isLoading && !error && (
          <div
            className={styles.segmented}
            role="group"
            aria-label="Spending view"
          >
            <button
              type="button"
              className={cx(
                styles.segment,
                view === 'mine' && styles.segmentActive,
              )}
              aria-pressed={view === 'mine'}
              onClick={() => setView('mine')}
            >
              My expenses
            </button>
            <button
              type="button"
              className={cx(
                styles.segment,
                view === 'journey' && styles.segmentActive,
              )}
              aria-pressed={view === 'journey'}
              onClick={() => setView('journey')}
            >
              Journey
            </button>
          </div>
        )}
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
            <p>
              No expenses yet. Add one from the toolbar, or from an activity
              on the timeline.
            </p>
            {canEdit ? (
              <Button onClick={openAdd}>
                <Plus size={14} aria-hidden="true" />
                Add expense
              </Button>
            ) : (
              <Button onClick={() => goJourney(journeyId)}>
                Back to journey
              </Button>
            )}
          </div>
        )}
        {!isLoading &&
          !error &&
          expenses.length > 0 &&
          view === 'mine' &&
          !splitsReady && (
            <LoadingState>Calculating your expenses…</LoadingState>
          )}
        {!isLoading &&
          !error &&
          expenses.length > 0 &&
          view === 'mine' &&
          splitsReady &&
          visibleExpenses.length === 0 && (
            <div className={styles.empty}>
              <p>No expenses involving you yet.</p>
              <Button variant="outline" onClick={() => setView('journey')}>
                View journey spending
              </Button>
            </div>
          )}
        {!isLoading &&
          !error &&
          expenses.length > 0 &&
          splitsReady &&
          activityRows.length > 0 && (
            <section className={styles.spendActivitySection}>
              <p className={styles.sectionTitle}>Your spending by activity</p>
              <ul className={styles.spendActivityList}>
                {activityRows.map((row) => {
                  const Icon = activityIcon(row.activityId)
                  return (
                    <li key={row.typeKey} className={styles.spendActivityRow}>
                      <span className={styles.spendActivityIcon} aria-hidden="true">
                        <Icon size={16} />
                      </span>
                      <span className={styles.spendActivityBody}>
                        <span className={styles.spendActivityName}>
                          {row.label}
                          <span className={styles.spendActivityCount}>
                            {row.count}{' '}
                            {row.count === 1 ? 'expense' : 'expenses'}
                          </span>
                        </span>
                        <span className={styles.spendActivityOriginal}>
                          {row.originals
                            .map((o) =>
                              formatMoney(o.cents, o.currency, displayLocale),
                            )
                            .join(' · ')}
                        </span>
                      </span>
                      <span className={styles.spendActivityPreferred}>
                        {row.preferredReady
                          ? formatMoney(
                              row.preferredCents,
                              row.preferredCurrency,
                              displayLocale,
                            )
                          : '—'}
                        <span className={styles.spendActivityPreferredHint}>
                          {row.preferredCurrency}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        {!isLoading &&
          !error &&
          expenses.length > 0 &&
          (view === 'journey' ||
            (view === 'mine' && splitsReady && visibleExpenses.length > 0)) && (
          <div className={styles.spendStage}>
            {byCurrency.map((bucket) => (
              <section key={bucket.currency} className={styles.spendCurrency}>
                <div className={styles.spendLayout}>
                  <aside className={styles.spendSummary}>
                    <p className={styles.sectionTitle}>{bucket.currency}</p>
                    <div className={styles.spendSummaryCard}>
                      <div className={styles.spendTotals}>
                        <span className={styles.spendTotalAmount}>
                          {formatMoney(
                            bucket.total,
                            bucket.currency,
                            displayLocale,
                          )}
                        </span>
                        <span className={styles.spendTotalMeta}>
                          {bucket.count}{' '}
                          {bucket.count === 1 ? 'expense' : 'expenses'}
                        </span>
                      </div>
                      <ul className={styles.spendPeople}>
                        {bucket.people.map((person) => (
                          <li
                            key={person.personId}
                            className={cx(
                              styles.spendPersonRow,
                              person.isYou && styles.spendPersonYou,
                            )}
                          >
                            <span className={styles.spendPersonName}>
                              {person.label}
                            </span>
                            <span className={styles.spendPersonStats}>
                              <span>
                                Paid{' '}
                                {formatMoney(
                                  person.paid,
                                  bucket.currency,
                                  displayLocale,
                                )}
                              </span>
                              <span>
                                Share{' '}
                                {formatMoney(
                                  person.share,
                                  bucket.currency,
                                  displayLocale,
                                )}
                              </span>
                              <span
                                className={cx(
                                  styles.spendNet,
                                  netToneClass(person.net, styles),
                                )}
                              >
                                {!splitsReady
                                  ? 'Calculating…'
                                  : netLabel(
                                      person.net,
                                      bucket.currency,
                                      displayLocale,
                                    )}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <div className={styles.spendListWrap}>
                    <p className={styles.sectionTitle}>Expenses</p>
                    <ul className={styles.spendList}>
                      {bucket.items.map((ex) => {
                        const paid = paidByLabel(ex)
                        const when = formatRelativeDay(
                          ex.createdAt,
                          displayLocale,
                        )
                        return (
                          <li key={ex.id}>
                            <button
                              type="button"
                              className={styles.spendRow}
                              onClick={() =>
                                goExpenseEdit({
                                  journeyId,
                                  entryId: ex.entryId,
                                  expenseId: ex.id,
                                })
                              }
                            >
                              <span className={styles.spendRowBody}>
                                <span className={styles.rowTitle}>
                                  {ex.title || 'Expense'}
                                </span>
                                <span className={styles.rowMeta}>
                                  {[paid, when].filter(Boolean).join(' · ')}
                                </span>
                              </span>
                              <span className={styles.spendRowAmount}>
                                {formatMoney(
                                  ex.amountCents,
                                  ex.currency,
                                  displayLocale,
                                )}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={addOpen}
        onDismiss={closeAdd}
        title="Add expense to which activity?"
      >
        <div className={styles.spendPick}>
          {entriesLoading && (
            <LoadingState>Loading activities…</LoadingState>
          )}
          {!entriesLoading && entries.length === 0 && (
            <div className={styles.empty}>
              <p>
                Expenses attach to an activity. Create one on the journey
                timeline first.
              </p>
              <Button
                onClick={() => {
                  closeAdd()
                  goJourney(journeyId)
                }}
              >
                Back to journey
              </Button>
            </div>
          )}
          {!entriesLoading && entries.length > 0 && (
            <>
              <Input
                className={styles.spendPickSearch}
                type="search"
                value={activityQuery}
                onChange={(e) => setActivityQuery(e.target.value)}
                placeholder="Search activities"
                aria-label="Search activities"
                autoFocus
              />
              {entryChoices.length === 0 ? (
                <p className={styles.hint}>No activities match that search.</p>
              ) : (
                <ul className={styles.spendPickList}>
                  {entryChoices.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        className={styles.spendPickRow}
                        onClick={() => pickEntry(entry.id)}
                      >
                        <span className={styles.rowTitle}>
                          {entry.title || 'Untitled activity'}
                        </span>
                        <span className={styles.rowMeta}>
                          {[
                            getActivity(entry.activityId)?.label ||
                              entry.activityId,
                            formatRelativeDay(
                              entryActivityIso(entry),
                              displayLocale,
                            ),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
