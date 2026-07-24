import { useMemo, useRef, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeInfo,
  Grid2x2Check,
  ListChecks,
  ListMusic,
  MapPin,
  Plus,
  Settings,
  Shapes,
  Users,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
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
  labelForSplitMode,
} from '@/lib/format'
import {
  convertCents,
  fetchRatesToPreferred,
  FRANKFURTER_SOURCE_URL,
} from '@/lib/fxRates'
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
    return `To receive ${formatMoney(net, currency, displayLocale)}`
  }
  if (net < 0) {
    return `To pay ${formatMoney(-net, currency, displayLocale)}`
  }
  return 'Even'
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

function ExpensesHeading({ currency } = {}) {
  return (
    <div className={styles.spendListHeading}>
      <p className={styles.sectionTitle}>
        {currency ? `Expenses · ${currency}` : 'Expenses'}
      </p>
      <ul className={styles.spendSplitLegend} aria-label="Split mode legend">
        <li>
          <span
            className={cx(styles.spendSplitBadge, styles.spendSplitEqual)}
            aria-hidden="true"
          >
            <Grid2x2Check size={12} />
          </span>
          <span>Equally</span>
        </li>
        <li>
          <span
            className={cx(styles.spendSplitBadge, styles.spendSplitSeparate)}
            aria-hidden="true"
          >
            <Shapes size={12} />
          </span>
          <span>Separately</span>
        </li>
      </ul>
    </div>
  )
}

const HIGH_VALUE_FX = new Set(['JPY', 'KRW', 'VND', 'IDR', 'HUF'])

function commonMajorAmounts(currency) {
  const code = String(currency || '').toUpperCase()
  if (HIGH_VALUE_FX.has(code)) return [100, 500, 1000, 5000, 10000]
  return [1, 5, 10, 20, 50, 100]
}

function majorToCents(major) {
  return Math.round(Number(major) * 100)
}

/** preferredCents → foreign minor units using toPreferred[foreign] mult. */
function preferredCentsToForeign(preferredCents, foreignCode, toPreferred) {
  const mult = toPreferred?.[String(foreignCode || '').toUpperCase()]
  if (!Number.isFinite(mult) || mult <= 0) return null
  return Math.round((Number(preferredCents) || 0) / mult)
}

function FxRatesBody({
  preferred,
  toPreferred,
  asOf,
  sourceUrl,
  displayLocale,
  loading,
}) {
  const foreignCodes = Object.entries(toPreferred || {})
    .filter(([, mult]) => Number.isFinite(mult) && mult > 0)
    .map(([code]) => code)
    .sort((a, b) => a.localeCompare(b))

  const [localCode, setLocalCode] = useState(null)
  const [direction, setDirection] = useState('localToPref')
  const selectedLocal =
    localCode && foreignCodes.includes(localCode)
      ? localCode
      : foreignCodes[0] || null

  const rows = foreignCodes.map((code) => {
    const oneUnitCents = convertCents(100, code, preferred, toPreferred)
    return {
      code,
      value:
        oneUnitCents != null
          ? formatMoney(oneUnitCents, preferred, displayLocale)
          : '—',
    }
  })

  const href = sourceUrl || FRANKFURTER_SOURCE_URL

  if (loading && rows.length === 0) {
    return <p className={styles.spendFxRatesMeta}>Loading rates…</p>
  }

  if (rows.length === 0 || !selectedLocal) {
    return <p className={styles.spendFxRatesMeta}>Rates unavailable.</p>
  }

  const isFrankfurter = href.includes('frankfurter')
  const sourceLabel = isFrankfurter ? 'Frankfurter' : 'currency-api'
  const sourceNote = isFrankfurter
    ? 'ECB daily rates'
    : 'community daily rates'

  const localToPref = direction === 'localToPref'
  const fromCode = localToPref ? selectedLocal : preferred
  const toCode = localToPref ? preferred : selectedLocal
  const ladder = commonMajorAmounts(fromCode)

  const cheatRows = ladder.map((major) => {
    const fromCents = majorToCents(major)
    const toCents = localToPref
      ? convertCents(fromCents, selectedLocal, preferred, toPreferred)
      : preferredCentsToForeign(fromCents, selectedLocal, toPreferred)
    return {
      key: `${direction}-${major}`,
      from: formatMoney(fromCents, fromCode, displayLocale),
      to:
        toCents != null ? formatMoney(toCents, toCode, displayLocale) : '—',
    }
  })

  return (
    <div className={styles.spendFxRates}>
      <ul className={styles.spendFxRatesList}>
        {rows.map((row) => (
          <li key={row.code}>
            <span className={styles.spendFxRateCode}>1 {row.code}</span>
            <span className={styles.spendFxRateValue}>{row.value}</span>
          </li>
        ))}
      </ul>

      {foreignCodes.length > 0 && (
        <div className={styles.spendFxCheat}>
          <p className={styles.spendFxCheatLabel}>Common amounts</p>
          <div
            className={styles.spendFxChips}
            role="group"
            aria-label="Local currency"
          >
            {foreignCodes.map((code) => (
              <button
                key={code}
                type="button"
                className={cx(
                  styles.spendFxChip,
                  code === selectedLocal && styles.spendFxChipActive,
                )}
                aria-pressed={code === selectedLocal}
                onClick={() => setLocalCode(code)}
              >
                {code}
              </button>
            ))}
          </div>

          <div className={styles.spendFxCheatDir}>
            <p className={styles.spendFxCheatDirLabel}>
              {fromCode} → {toCode}
            </p>
            <button
              type="button"
              className={styles.spendFxSwap}
              aria-pressed={!localToPref}
              aria-label={`Swap to ${toCode} → ${fromCode}`}
              onClick={() =>
                setDirection((d) =>
                  d === 'localToPref' ? 'prefToLocal' : 'localToPref',
                )
              }
            >
              <ArrowLeftRight size={14} aria-hidden="true" />
              Swap
            </button>
          </div>

          <table className={styles.spendFxCheatTable}>
            <thead>
              <tr>
                <th scope="col">{fromCode}</th>
                <th scope="col">{toCode}</th>
              </tr>
            </thead>
            <tbody>
              {cheatRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.spendFxRatesMeta}>
        {asOf ? <>As of {asOf} · </> : null}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {sourceLabel}
        </a>
        {' '}
        ({sourceNote})
      </p>
    </div>
  )
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
    goTodos,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale, defaultCurrency } = useDisplayPrefs()
  const [addOpen, setAddOpen] = useState(false)
  const [activityQuery, setActivityQuery] = useState('')
  const [view, setView] = useState('mine')
  const [fxOpen, setFxOpen] = useState(false)
  const fxBtnRef = useRef(null)

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
          const aAbs = Math.abs(a.net)
          const bAbs = Math.abs(b.net)
          if (aAbs !== bAbs) return bAbs - aAbs
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

  /** Journey: group expense totals by activity type within each native currency. */
  const journeyActivityByCurrency = useMemo(() => {
    const map = new Map()
    if (view !== 'journey') return map

    for (const ex of sortedExpenses) {
      const entry = entryById.get(ex.entryId)
      const activityId = entry?.activityId || null
      const activity = activityId ? getActivity(activityId) : null
      const typeKey = activity?.id || ex.category || 'other'
      const label =
        activity?.label ||
        (ex.category
          ? ex.category.charAt(0).toUpperCase() + ex.category.slice(1)
          : 'Other')

      let byType = map.get(ex.currency)
      if (!byType) {
        byType = new Map()
        map.set(ex.currency, byType)
      }
      const group = byType.get(typeKey) || {
        typeKey,
        activityId,
        label,
        count: 0,
        cents: 0,
      }
      group.count += 1
      group.cents += Number(ex.amountCents) || 0
      byType.set(typeKey, group)
    }

    const out = new Map()
    for (const [currency, byType] of map) {
      const rows = [...byType.values()]
      const total = rows.reduce((sum, row) => sum + row.cents, 0)
      out.set(
        currency,
        rows
          .map((row) => ({
            ...row,
            sharePct:
              total > 0
                ? Math.round((row.cents / total) * 1000) / 10
                : null,
          }))
          .sort((a, b) => b.cents - a.cents || a.label.localeCompare(b.label)),
      )
    }
    return out
  }, [view, sortedExpenses, entryById])

  function jumpToCurrency(currency) {
    const el = document.getElementById(`spend-currency-${currency}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

  const fxSourceCurrencies = useMemo(
    () => [
      ...new Set(
        [
          ...sortedExpenses.map((ex) => ex.currency),
          ...myActivitySpend.flatMap((g) =>
            g.originals.map((o) => o.currency),
          ),
          ...visibleExpenses.map((ex) => ex.currency),
        ].filter(Boolean),
      ),
    ],
    [sortedExpenses, myActivitySpend, visibleExpenses],
  )

  const {
    data: fx = {
      preferred: preferredCurrency,
      toPreferred: {},
      asOf: null,
      sourceUrl: FRANKFURTER_SOURCE_URL,
    },
    isPending: fxPending,
    isFetching: fxFetching,
    isError: fxError,
  } = useQuery({
    queryKey: ['fx', preferredCurrency, fxSourceCurrencies.join(',')],
    queryFn: () =>
      fetchRatesToPreferred(preferredCurrency, fxSourceCurrencies),
    enabled: fxSourceCurrencies.length > 0 && !!preferredCurrency,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })

  const fxPreferred = fx.preferred || preferredCurrency

  const activityRows = useMemo(() => {
    const rows = myActivitySpend.map((g) => {
      let preferredCents = 0
      let preferredReady = true
      for (const { currency, cents } of g.originals) {
        const conv = convertCents(
          cents,
          currency,
          fxPreferred,
          fx.toPreferred,
        )
        if (conv == null) preferredReady = false
        else preferredCents += conv
      }
      return {
        ...g,
        preferredCents,
        preferredReady,
        preferredCurrency: fxPreferred,
      }
    })
    const totalPreferred = rows.reduce(
      (sum, row) =>
        sum + (row.preferredReady ? row.preferredCents : 0),
      0,
    )
    return rows
      .map((row) => ({
        ...row,
        sharePct:
          row.preferredReady && totalPreferred > 0
            ? Math.round((row.preferredCents / totalPreferred) * 1000) / 10
            : null,
      }))
      .sort((a, b) => {
        if (a.preferredReady && b.preferredReady) {
          return b.preferredCents - a.preferredCents
        }
        if (a.preferredReady !== b.preferredReady) {
          return a.preferredReady ? -1 : 1
        }
        return a.label.localeCompare(b.label)
      })
  }, [myActivitySpend, fx.toPreferred, fxPreferred])

  /** My expenses: one preferred-currency settlement + converted expense rows. */
  const myPreferredView = useMemo(() => {
    if (view !== 'mine' || !myPersonId || !splitsReady) return null

    let paid = 0
    let share = 0
    let ready = true
    const items = []

    for (const ex of visibleExpenses) {
      const splits = splitsByExpenseId.get(ex.id) || []
      const mySplit = splits.find((s) => s.journeyPersonId === myPersonId)
      const myShareCents =
        mySplit && Number(mySplit.amountCents) > 0
          ? Number(mySplit.amountCents)
          : 0
      const paidCents =
        ex.paidBy === myPersonId ? Number(ex.amountCents) || 0 : 0

      const paidConv = paidCents
        ? convertCents(paidCents, ex.currency, fxPreferred, fx.toPreferred)
        : 0
      const shareConv = myShareCents
        ? convertCents(
            myShareCents,
            ex.currency,
            fxPreferred,
            fx.toPreferred,
          )
        : 0
      const amountConv = convertCents(
        Number(ex.amountCents) || 0,
        ex.currency,
        fxPreferred,
        fx.toPreferred,
      )

      if (
        (paidCents && paidConv == null) ||
        (myShareCents && shareConv == null) ||
        amountConv == null
      ) {
        ready = false
      } else {
        paid += paidConv || 0
        share += shareConv || 0
      }

      items.push({
        ex,
        amountPreferredCents: amountConv,
        sharePreferredCents: shareConv,
        ready:
          myShareCents === 0
            ? true
            : shareConv != null && amountConv != null,
      })
    }

    return {
      currency: fxPreferred,
      paid,
      share,
      net: paid - share,
      ready,
      count: items.length,
      items,
    }
  }, [
    view,
    myPersonId,
    splitsReady,
    visibleExpenses,
    splitsByExpenseId,
    fx.toPreferred,
    fxPreferred,
  ])

  /** Journey: all travelers rolled into viewer preferred currency. */
  const journeyPreferredView = useMemo(() => {
    if (view !== 'journey' || !splitsReady || sortedExpenses.length === 0) {
      return null
    }

    const people = new Map()
    const ensure = (personId) => {
      if (!personId) return null
      if (!people.has(personId)) {
        people.set(personId, { personId, paid: 0, share: 0 })
      }
      return people.get(personId)
    }

    for (const person of roster) {
      ensure(person.id)
    }

    let total = 0
    let ready = true
    let count = 0

    for (const ex of sortedExpenses) {
      count += 1
      const amountConv = convertCents(
        Number(ex.amountCents) || 0,
        ex.currency,
        fxPreferred,
        fx.toPreferred,
      )
      if (amountConv == null) ready = false
      else total += amountConv

      if (ex.paidBy) {
        const payer = ensure(ex.paidBy)
        if (payer) {
          const paidCents = Number(ex.amountCents) || 0
          if (paidCents > 0) {
            const paidConv = convertCents(
              paidCents,
              ex.currency,
              fxPreferred,
              fx.toPreferred,
            )
            if (paidConv == null) ready = false
            else payer.paid += paidConv
          }
        }
      }

      const splits = splitsByExpenseId.get(ex.id) || []
      for (const split of splits) {
        const row = ensure(split.journeyPersonId)
        if (!row) continue
        const shareCents = Number(split.amountCents) || 0
        if (shareCents <= 0) continue
        const shareConv = convertCents(
          shareCents,
          ex.currency,
          fxPreferred,
          fx.toPreferred,
        )
        if (shareConv == null) ready = false
        else row.share += shareConv
      }
    }

    const peopleRows = [...people.values()]
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
        const aAbs = Math.abs(a.net)
        const bAbs = Math.abs(b.net)
        if (aAbs !== bAbs) return bAbs - aAbs
        return a.label.localeCompare(b.label)
      })

    return {
      currency: fxPreferred,
      total,
      ready,
      count,
      people: peopleRows,
    }
  }, [
    view,
    splitsReady,
    sortedExpenses,
    splitsByExpenseId,
    roster,
    myPersonId,
    user?.id,
    fx.toPreferred,
    fxPreferred,
  ])

  const hasForeignCurrencies = fxSourceCurrencies.some(
    (c) => String(c || '').toUpperCase() !== String(preferredCurrency || '').toUpperCase(),
  )
  const fxLoading =
    hasForeignCurrencies &&
    !fxError &&
    (fxPending || fxFetching) &&
    Object.keys(fx.toPreferred || {}).length === 0

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
          canEdit || hasForeignCurrencies ? (
            <div className={styles.toolbar}>
              {canEdit ? (
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
              ) : null}
              {hasForeignCurrencies ? (
                <>
                  <Button
                    ref={fxBtnRef}
                    variant="ghost"
                    size="sm"
                    className={styles.iconBtn}
                    onClick={() => setFxOpen((o) => !o)}
                    aria-label="Exchange rates"
                    title="Exchange rates"
                    aria-expanded={fxOpen}
                    aria-haspopup="dialog"
                  >
                    <BadgeInfo size={14} aria-hidden="true" />
                  </Button>
                  <AnchoredPopover
                    open={fxOpen}
                    onClose={() => setFxOpen(false)}
                    title="Exchange rates"
                    anchorRef={fxBtnRef}
                    align="end"
                    fluid
                    className={styles.spendFxPopover}
                  >
                    <FxRatesBody
                      preferred={fxPreferred}
                      toPreferred={fx.toPreferred}
                      asOf={fx.asOf}
                      sourceUrl={fx.sourceUrl}
                      displayLocale={displayLocale}
                      loading={fxLoading}
                    />
                  </AnchoredPopover>
                </>
              ) : null}
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
                id: 'todos',
                label: 'To-dos',
                icon: ListChecks,
                pick: () => () => goTodos(journeyId),
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
          view === 'mine' &&
          splitsReady &&
          activityRows.length > 0 && (
            <section className={styles.spendActivitySection}>
              <p className={styles.sectionTitle}>Your spending by activity</p>
              <ul className={styles.spendActivityList}>
                {activityRows.map((row) => {
                  const Icon = activityIcon(row.activityId)
                  const amountLabel = row.preferredReady
                    ? formatMoney(
                        row.preferredCents,
                        row.preferredCurrency,
                        displayLocale,
                      )
                    : '—'
                  const pctLabel =
                    row.sharePct != null ? `${row.sharePct}%` : null
                  return (
                    <li
                      key={row.typeKey}
                      className={styles.spendActivityRow}
                      aria-label={
                        pctLabel
                          ? `${row.label}, ${amountLabel}, ${pctLabel} of your spending`
                          : `${row.label}, ${amountLabel}`
                      }
                    >
                      <span className={styles.spendActivityIcon} aria-hidden="true">
                        <Icon size={16} />
                      </span>
                      <span className={styles.spendActivityBody}>
                        <span className={styles.spendActivityName}>
                          {row.label}
                          <span className={styles.spendActivityCount}>
                            {row.count}{' '}
                            {row.count === 1 ? 'expense' : 'expenses'}
                            {pctLabel ? ` · ${pctLabel}` : ''}
                          </span>
                        </span>
                        <span
                          className={styles.spendActivityBarTrack}
                          aria-hidden="true"
                        >
                          <span
                            className={styles.spendActivityBarFill}
                            style={{
                              width:
                                row.sharePct != null
                                  ? `${Math.max(row.sharePct, row.sharePct > 0 ? 2 : 0)}%`
                                  : '0%',
                            }}
                          />
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
                        {amountLabel}
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
          view === 'mine' &&
          splitsReady &&
          myPreferredView &&
          myPreferredView.count > 0 && (
            <div className={styles.spendStage}>
              <section className={styles.spendCurrency}>
                <div className={styles.spendLayout}>
                  <aside className={styles.spendSummary}>
                    <p className={styles.sectionTitle}>
                      {myPreferredView.currency}
                    </p>
                    <div className={styles.spendSummaryCard}>
                      <div className={styles.spendTotals}>
                        <span className={styles.spendTotalAmount}>
                          {myPreferredView.ready
                            ? formatMoney(
                                myPreferredView.share,
                                myPreferredView.currency,
                                displayLocale,
                              )
                            : '—'}
                        </span>
                        <span className={styles.spendTotalMeta}>
                          Your share · {myPreferredView.count}{' '}
                          {myPreferredView.count === 1
                            ? 'expense'
                            : 'expenses'}
                        </span>
                      </div>
                      <ul className={styles.spendPeople}>
                        <li
                          className={cx(
                            styles.spendPersonRow,
                            styles.spendPersonYou,
                          )}
                        >
                          <div className={styles.spendPersonPrimary}>
                            <span className={styles.spendPersonName}>You</span>
                            <span
                              className={cx(
                                styles.spendNet,
                                netToneClass(myPreferredView.net, styles),
                              )}
                            >
                              {!myPreferredView.ready
                                ? 'Calculating…'
                                : netLabel(
                                    myPreferredView.net,
                                    myPreferredView.currency,
                                    displayLocale,
                                  )}
                            </span>
                          </div>
                          <span className={styles.spendPersonStats}>
                            Paid{' '}
                            {myPreferredView.ready
                              ? formatMoney(
                                  myPreferredView.paid,
                                  myPreferredView.currency,
                                  displayLocale,
                                )
                              : '—'}
                            {' · '}
                            Share{' '}
                            {myPreferredView.ready
                              ? formatMoney(
                                  myPreferredView.share,
                                  myPreferredView.currency,
                                  displayLocale,
                                )
                              : '—'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </aside>

                  <div className={styles.spendListWrap}>
                    <ExpensesHeading />
                    <ul className={styles.spendList}>
                      {myPreferredView.items.map(
                        ({ ex, sharePreferredCents, ready }) => {
                          const paid = paidByLabel(ex)
                          const when = formatRelativeDay(
                            ex.createdAt,
                            displayLocale,
                          )
                          const original = formatMoney(
                            ex.amountCents,
                            ex.currency,
                            displayLocale,
                          )
                          const splitLabel = labelForSplitMode(ex.splitMode)
                          const shareReady = sharePreferredCents != null
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
                                  <span className={styles.spendRowTitleRow}>
                                    <span className={styles.rowTitle}>
                                      {ex.title || 'Expense'}
                                    </span>
                                    <span
                                      className={cx(
                                        styles.spendSplitBadge,
                                        ex.splitMode === 'custom'
                                          ? styles.spendSplitSeparate
                                          : styles.spendSplitEqual,
                                      )}
                                      role="img"
                                      aria-label={splitLabel}
                                      title={splitLabel}
                                    >
                                      {ex.splitMode === 'custom' ? (
                                        <Shapes size={12} aria-hidden="true" />
                                      ) : (
                                        <Grid2x2Check
                                          size={12}
                                          aria-hidden="true"
                                        />
                                      )}
                                    </span>
                                  </span>
                                  <span className={styles.rowMeta}>
                                    {[paid, when, `Bill ${original}`]
                                      .filter(Boolean)
                                      .join(' · ')}
                                  </span>
                                </span>
                                <span className={styles.spendRowAmount}>
                                  {ready && shareReady
                                    ? formatMoney(
                                        sharePreferredCents,
                                        myPreferredView.currency,
                                        displayLocale,
                                      )
                                    : '—'}
                                </span>
                              </button>
                            </li>
                          )
                        },
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}
        {!isLoading &&
          !error &&
          expenses.length > 0 &&
          view === 'journey' && (
          <div className={styles.spendStage}>
            {journeyPreferredView && (
              <section className={styles.spendPreferredSummary}>
                <p className={styles.sectionTitle}>
                  {journeyPreferredView.currency}
                </p>
                <div className={styles.spendSummaryCard}>
                  <div className={styles.spendTotals}>
                    <span className={styles.spendTotalAmount}>
                      {journeyPreferredView.ready
                        ? formatMoney(
                            journeyPreferredView.total,
                            journeyPreferredView.currency,
                            displayLocale,
                          )
                        : '—'}
                    </span>
                    <span className={styles.spendTotalMeta}>
                      {journeyPreferredView.count}{' '}
                      {journeyPreferredView.count === 1
                        ? 'expense'
                        : 'expenses'}
                      <span className={styles.spendTotalNativeHint}>
                        {' '}
                        · all currencies · in {journeyPreferredView.currency}
                      </span>
                    </span>
                  </div>
                  <ul className={styles.spendPeople}>
                    {journeyPreferredView.people.map((person) => (
                      <li
                        key={person.personId}
                        className={cx(
                          styles.spendPersonRow,
                          person.isYou && styles.spendPersonYou,
                        )}
                      >
                        <div className={styles.spendPersonPrimary}>
                          <span className={styles.spendPersonName}>
                            {person.label}
                          </span>
                          <span
                            className={cx(
                              styles.spendNet,
                              netToneClass(person.net, styles),
                            )}
                          >
                            {!journeyPreferredView.ready
                              ? 'Calculating…'
                              : netLabel(
                                  person.net,
                                  journeyPreferredView.currency,
                                  displayLocale,
                                )}
                          </span>
                        </div>
                        <span className={styles.spendPersonStats}>
                          Paid{' '}
                          {journeyPreferredView.ready
                            ? formatMoney(
                                person.paid,
                                journeyPreferredView.currency,
                                displayLocale,
                              )
                            : '—'}
                          {' · '}
                          Share{' '}
                          {journeyPreferredView.ready
                            ? formatMoney(
                                person.share,
                                journeyPreferredView.currency,
                                displayLocale,
                              )
                            : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
            {byCurrency.length > 1 && (
              <nav
                className={styles.spendCurrencyNav}
                aria-label="Jump to currency"
              >
                {byCurrency.map((bucket) => (
                  <button
                    key={bucket.currency}
                    type="button"
                    className={styles.spendCurrencyChip}
                    onClick={() => jumpToCurrency(bucket.currency)}
                  >
                    {bucket.currency}
                    <span className={styles.spendCurrencyChipMeta}>
                      {bucket.count}
                    </span>
                  </button>
                ))}
              </nav>
            )}
            {byCurrency.map((bucket) => {
              const activityRowsForCurrency =
                journeyActivityByCurrency.get(bucket.currency) || []
              return (
              <section
                key={bucket.currency}
                id={`spend-currency-${bucket.currency}`}
                className={styles.spendCurrency}
              >
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
                          <span className={styles.spendTotalNativeHint}>
                            {' '}
                            · native currency
                          </span>
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
                            <div className={styles.spendPersonPrimary}>
                              <span className={styles.spendPersonName}>
                                {person.label}
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
                            </div>
                            <span className={styles.spendPersonStats}>
                              Paid{' '}
                              {formatMoney(
                                person.paid,
                                bucket.currency,
                                displayLocale,
                              )}
                              {' · '}
                              Share{' '}
                              {formatMoney(
                                person.share,
                                bucket.currency,
                                displayLocale,
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <div className={styles.spendListWrap}>
                    {activityRowsForCurrency.length > 0 && (
                      <section className={styles.spendActivitySection}>
                        <p className={styles.sectionTitle}>
                          Spending by activity · {bucket.currency}
                        </p>
                        <ul className={styles.spendActivityList}>
                          {activityRowsForCurrency.map((row) => {
                            const Icon = activityIcon(row.activityId)
                            const amountLabel = formatMoney(
                              row.cents,
                              bucket.currency,
                              displayLocale,
                            )
                            const pctLabel =
                              row.sharePct != null
                                ? `${row.sharePct}%`
                                : null
                            return (
                              <li
                                key={row.typeKey}
                                className={styles.spendActivityRow}
                                aria-label={
                                  pctLabel
                                    ? `${row.label}, ${amountLabel}, ${pctLabel} of ${bucket.currency} spending`
                                    : `${row.label}, ${amountLabel}`
                                }
                              >
                                <span
                                  className={styles.spendActivityIcon}
                                  aria-hidden="true"
                                >
                                  <Icon size={16} />
                                </span>
                                <span className={styles.spendActivityBody}>
                                  <span className={styles.spendActivityName}>
                                    {row.label}
                                    <span className={styles.spendActivityCount}>
                                      {row.count}{' '}
                                      {row.count === 1
                                        ? 'expense'
                                        : 'expenses'}
                                      {pctLabel ? ` · ${pctLabel}` : ''}
                                    </span>
                                  </span>
                                  <span
                                    className={styles.spendActivityBarTrack}
                                    aria-hidden="true"
                                  >
                                    <span
                                      className={styles.spendActivityBarFill}
                                      style={{
                                        width:
                                          row.sharePct != null
                                            ? `${Math.max(
                                                row.sharePct,
                                                row.sharePct > 0 ? 2 : 0,
                                              )}%`
                                            : '0%',
                                      }}
                                    />
                                  </span>
                                </span>
                                <span className={styles.spendActivityPreferred}>
                                  {amountLabel}
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </section>
                    )}
                    <ExpensesHeading currency={bucket.currency} />
                    <ul className={styles.spendList}>
                      {bucket.items.map((ex) => {
                        const paid = paidByLabel(ex)
                        const when = formatRelativeDay(
                          ex.createdAt,
                          displayLocale,
                        )
                        const splitLabel = labelForSplitMode(ex.splitMode)
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
                                <span className={styles.spendRowTitleRow}>
                                  <span className={styles.rowTitle}>
                                    {ex.title || 'Expense'}
                                  </span>
                                  <span
                                    className={cx(
                                      styles.spendSplitBadge,
                                      ex.splitMode === 'custom'
                                        ? styles.spendSplitSeparate
                                        : styles.spendSplitEqual,
                                    )}
                                    role="img"
                                    aria-label={splitLabel}
                                    title={splitLabel}
                                  >
                                    {ex.splitMode === 'custom' ? (
                                      <Shapes size={12} aria-hidden="true" />
                                    ) : (
                                      <Grid2x2Check
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
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
              )
            })}
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
