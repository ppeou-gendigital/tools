import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ParticipantChips } from '@/molecules/ParticipantChips'
import { Select } from '@/molecules/Select'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import { COMMON_CURRENCIES } from '@/lib/catalog'
import {
  centsToDollarsInput,
  dollarsToCents,
  formatMoney,
  labelForJourneyPerson,
} from '@/lib/format'
import {
  deleteExpense,
  getExpense,
  getJourney,
  listJourneyPeople,
  listSplits,
  myMembership,
  upsertExpenseWithSplits,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function ExpenseEdit() {
  const { params, goBack, previousRouteLabel, goHome } = useNavigation()
  const { journeyId, entryId, expenseId } = params
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()

  const { data: journey, isLoading: journeyLoading } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const { data: roster = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const { data: existing, isLoading: expenseLoading } = useQuery({
    queryKey: ['viaggio', 'expense', expenseId],
    queryFn: () => getExpense(expenseId),
    enabled: !!expenseId,
  })

  const { data: existingSplits = [], isLoading: splitsLoading } = useQuery({
    queryKey: ['viaggio', 'splits', expenseId],
    queryFn: () => listSplits(expenseId),
    enabled: !!expenseId,
  })

  const stillLoading =
    journeyLoading ||
    rosterLoading ||
    (!!expenseId && (expenseLoading || splitsLoading))
  const missing =
    !stillLoading &&
    (!journey || !user || (expenseId && !existing))
  const ready =
    !!journeyId &&
    !!entryId &&
    !!journey &&
    !!user &&
    !journeyLoading &&
    !rosterLoading &&
    roster.length > 0 &&
    (!expenseId || (!expenseLoading && !splitsLoading && existing))

  if (!journeyId || !entryId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing expense context.</p>
        </div>
      </div>
    )
  }

  if (stillLoading || (!ready && !missing)) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Expense"
          leading={
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={14} />
              {previousRouteLabel ?? 'Back'}
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading expense…</LoadingState>
        </div>
      </div>
    )
  }

  if (missing || !ready) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Expense"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>
            {!journey || (expenseId && !existing)
              ? 'This expense was not found, or you no longer have access.'
              : 'Could not load expense details.'}
          </p>
          <Button onClick={goHome} fullWidth>
            Back to journeys
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ExpenseEditForm
      key={expenseId || `new-${entryId}`}
      journey={journey}
      existing={existing || null}
      existingSplits={existingSplits}
      expenseId={expenseId || null}
      entryId={entryId}
      roster={roster}
      membership={membership}
      user={user}
      displayLocale={displayLocale}
      goBack={goBack}
      previousRouteLabel={previousRouteLabel}
    />
  )
}

function ExpenseEditForm({
  journey,
  existing,
  existingSplits,
  expenseId,
  entryId,
  roster,
  membership,
  user,
  displayLocale,
  goBack,
  previousRouteLabel,
}) {
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

  const selfPersonId =
    roster.find((p) => p.linkedUserId === user.id)?.id || roster[0]?.id

  const [title, setTitle] = useState(existing?.title || '')
  const [amount, setAmount] = useState(
    existing ? centsToDollarsInput(existing.amountCents) : '',
  )
  const [currency, setCurrency] = useState(
    existing?.currency || journey.defaultCurrency,
  )
  const [paidBy, setPaidBy] = useState(existing?.paidBy || selfPersonId)
  const [splitMode, setSplitMode] = useState(existing?.splitMode || 'equal')
  const [category, setCategory] = useState(existing?.category || '')
  const [selected, setSelected] = useState(() =>
    existing
      ? new Set(existingSplits.map((s) => s.journeyPersonId))
      : new Set(roster.map((p) => p.id)),
  )
  const [customAmounts, setCustomAmounts] = useState(() =>
    Object.fromEntries(
      existingSplits.map((s) => [
        s.journeyPersonId,
        centsToDollarsInput(s.amountCents),
      ]),
    ),
  )

  const amountCents = dollarsToCents(amount)

  const computedSplits = useMemo(() => {
    const participants = [...selected]
    if (!participants.length || amountCents == null) return []
    if (splitMode === 'equal') {
      const base = Math.floor(amountCents / participants.length)
      let rem = amountCents - base * participants.length
      return participants.map((journeyPersonId) => {
        const extra = rem > 0 ? 1 : 0
        if (rem > 0) rem -= 1
        return { journeyPersonId, amountCents: base + extra }
      })
    }
    return participants.map((journeyPersonId) => ({
      journeyPersonId,
      amountCents: dollarsToCents(customAmounts[journeyPersonId] ?? '0') ?? 0,
    }))
  }, [selected, amountCents, splitMode, customAmounts])

  const splitSum = computedSplits.reduce((s, x) => s + x.amountCents, 0)
  const remaining =
    amountCents != null ? amountCents - splitSum : null
  const splitOk =
    amountCents != null &&
    computedSplits.length > 0 &&
    splitSum === amountCents

  const saveMut = useMutation({
    mutationFn: () =>
      upsertExpenseWithSplits({
        id: expenseId || null,
        entryId,
        title,
        amountCents,
        currency,
        paidBy,
        splitMode,
        category: category || null,
        splits: computedSplits,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'entry-expenses', entryId] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'expenses', journey.id] })
      // Pop back to the entry — replace() was duplicating entry-edit on the stack
      // so the header "Back" button appeared stuck.
      goBack()
    },
    onError: (err) => setError(err.message || 'Save failed'),
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteExpense(expenseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'entry-expenses', entryId] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'expenses', journey.id] })
      goBack()
    },
  })

  function togglePerson(journeyPersonId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(journeyPersonId)) next.delete(journeyPersonId)
      else next.add(journeyPersonId)
      return next
    })
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={expenseId ? 'Edit expense' : 'Add expense'}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit && expenseId ? (
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtnDanger}
              onClick={() => setConfirmDelete(true)}
              disabled={deleteMut.isPending}
              aria-label={deleteMut.isPending ? 'Deleting…' : 'Delete'}
              title={deleteMut.isPending ? 'Deleting…' : 'Delete'}
            >
              <Trash2 size={14} aria-hidden="true" />
            </Button>
          ) : null
        }
      />

      <ConfirmDialog
        open={confirmDelete}
        onDismiss={() => setConfirmDelete(false)}
        title="Delete expense?"
        message="This removes the expense and its splits. This cannot be undone."
        confirmLabel="Delete"
        confirming={deleteMut.isPending}
        onConfirm={() => deleteMut.mutate()}
      />

      <div className={cx('is-fluid-width', styles.body)}>
        {!canEdit && (
          <p className={styles.readOnlyBanner}>
            You can view this expense. Only editors can change it.
          </p>
        )}
        <div className={cx(styles.form, styles.formNarrow, styles.formGrid)}>
          <div className={cx(styles.field, styles.formSpan2)}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              disabled={!canEdit}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              inputMode="decimal"
              value={amount}
              disabled={!canEdit}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={currency}
              disabled={!canEdit}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.field}>
            <Label htmlFor="paidBy">Paid by</Label>
            <Select
              id="paidBy"
              value={paidBy}
              disabled={!canEdit}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {roster.map((p) => (
                <option key={p.id} value={p.id}>
                  {labelForJourneyPerson(p, user?.id)}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.field}>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              disabled={!canEdit}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className={cx(styles.field, styles.formSpan2)}>
            <Label>Split mode</Label>
            <div className={styles.segmented} role="group" aria-label="Split mode">
              <button
                type="button"
                className={cx(
                  styles.segment,
                  splitMode === 'equal' && styles.segmentActive,
                )}
                disabled={!canEdit}
                onClick={() => setSplitMode('equal')}
              >
                Equal
              </button>
              <button
                type="button"
                className={cx(
                  styles.segment,
                  splitMode === 'custom' && styles.segmentActive,
                )}
                disabled={!canEdit}
                onClick={() => setSplitMode('custom')}
              >
                Custom
              </button>
            </div>
          </div>

          <div className={styles.formSpan2}>
            <p className={styles.sectionTitle}>Participants</p>
            <ParticipantChips
              roster={roster}
              selected={selected}
              onToggle={togglePerson}
              currentUserId={user?.id}
              readOnly={!canEdit}
            />
            {splitMode === 'custom' && selected.size > 0 && (
              <ul className={styles.list}>
                {[...selected].map((id) => {
                  const p = roster.find((r) => r.id === id)
                  if (!p) return null
                  return (
                    <li key={id}>
                      <div className={styles.splitRow}>
                        <span className={styles.rowTitle}>
                          {labelForJourneyPerson(p, user?.id)}
                        </span>
                        <Input
                          className={styles.splitAmount}
                          inputMode="decimal"
                          value={customAmounts[id] || ''}
                          disabled={!canEdit}
                          onChange={(e) =>
                            setCustomAmounts((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                          aria-label={`Split amount for ${labelForJourneyPerson(p, user?.id)}`}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            {splitMode === 'custom' && remaining != null && (
              <p
                className={
                  remaining === 0 ? styles.hint : styles.error
                }
              >
                {remaining === 0
                  ? 'Splits match the total.'
                  : `Remaining ${formatMoney(remaining, currency, displayLocale)}`}
              </p>
            )}
          </div>

          {!splitOk && amountCents != null && splitMode === 'equal' && (
            <p className={cx(styles.error, styles.formSpan2)}>
              Add at least one participant to split the total.
            </p>
          )}
          {error && (
            <p className={cx(styles.error, styles.formSpan2)} role="alert">
              {error}
            </p>
          )}

          {canEdit && (
            <div className={cx(styles.actionsSticky, styles.formSpan2)}>
              <Button
                disabled={!splitOk || saveMut.isPending}
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
              >
                {saveMut.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Saving
                  </>
                ) : (
                  'Save expense'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
