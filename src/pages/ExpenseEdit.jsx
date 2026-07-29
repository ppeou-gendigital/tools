import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Grid2x2Check,
  Loader2,
  Pencil,
  Save,
  Shapes,
  Trash2,
} from 'lucide-react'
import { ActivityLinkChips } from '@/molecules/ActivityLinkChips'
import { AttachmentCard } from '@/molecules/AttachmentCard'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { ParticipantChips } from '@/molecules/ParticipantChips'
import { ReceiptField } from '@/molecules/ReceiptField'
import { Select } from '@/molecules/Select'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import {
  deleteAttachment,
  formatByteSize,
  listAttachments,
  MAX_ATTACHMENT_BYTES,
  uploadAttachment,
} from '@/lib/attachmentsApi'
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
  listEntries,
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
  const {
    params,
    goBack,
    previousRouteLabel,
    goHome,
    goAttachmentEdit,
    replace,
  } = useNavigation()
  const { journeyId, entryId, expenseId, viewOnly } = params
  const isViewOnly = !!viewOnly
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
    !!journey &&
    !!user &&
    !journeyLoading &&
    !rosterLoading &&
    roster.length > 0 &&
    (!expenseId || (!expenseLoading && !splitsLoading && existing))

  if (!journeyId) {
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
      key={`${expenseId || `new-${entryId || 'journey'}`}-${isViewOnly ? 'view' : 'edit'}`}
      journey={journey}
      existing={existing || null}
      existingSplits={existingSplits}
      expenseId={expenseId || null}
      entryId={entryId || null}
      viewOnly={isViewOnly}
      roster={roster}
      membership={membership}
      user={user}
      displayLocale={displayLocale}
      goBack={goBack}
      previousRouteLabel={previousRouteLabel}
      goAttachmentEdit={goAttachmentEdit}
      replace={replace}
    />
  )
}

function initialEntryIds(existing, routeEntryId) {
  const fromExisting = existing?.entryIds?.length
    ? existing.entryIds
    : existing?.entryId
      ? [existing.entryId]
      : []
  if (fromExisting.length) return fromExisting
  return routeEntryId ? [routeEntryId] : []
}

function ExpenseEditForm({
  journey,
  existing,
  existingSplits,
  expenseId,
  entryId,
  viewOnly = false,
  roster,
  membership,
  user,
  displayLocale,
  goBack,
  previousRouteLabel,
  goAttachmentEdit,
  replace,
}) {
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pendingReceipts, setPendingReceipts] = useState([])
  const [receiptBusy, setReceiptBusy] = useState(false)
  const membershipCanEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const canEdit = membershipCanEdit && !viewOnly

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
  const [linkedEntryIds, setLinkedEntryIds] = useState(
    () => new Set(initialEntryIds(existing, entryId)),
  )
  const [primaryEntryId, setPrimaryEntryId] = useState(
    () => existing?.entryId || entryId || null,
  )

  const { data: journeyEntries = [] } = useQuery({
    queryKey: ['viaggio', 'entries', journey.id],
    queryFn: () => listEntries(journey.id),
    enabled: !!journey.id,
  })

  const receiptsQueryKey = [
    'viaggio',
    'expense-receipts',
    journey.id,
    primaryEntryId || 'journey',
    expenseId,
  ]
  const { data: receipts = [] } = useQuery({
    queryKey: receiptsQueryKey,
    queryFn: () =>
      listAttachments(primaryEntryId, {
        expenseId,
        journeyId: journey.id,
      }),
    enabled: !!expenseId,
  })

  async function uploadReceiptFiles(files, forExpenseId) {
    const list = [...(files || [])]
    for (const file of list) {
      if ((file.size ?? 0) > MAX_ATTACHMENT_BYTES) {
        throw new Error(
          `“${file.name || 'File'}” is too large (max ${Math.round(MAX_ATTACHMENT_BYTES / (1024 * 1024))} MB).`,
        )
      }
      await uploadAttachment({
        journeyId: journey.id,
        userId: user.id,
        file,
        expenseIds: forExpenseId ? [forExpenseId] : [],
        entryIds: [...linkedEntryIds],
      })
    }
  }

  function toggleEntryLink(id) {
    setLinkedEntryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        if (primaryEntryId === id) {
          setPrimaryEntryId([...next][0] || null)
        }
      } else {
        next.add(id)
        if (!primaryEntryId) setPrimaryEntryId(id)
      }
      return next
    })
  }

  function setPrimary(id) {
    if (!linkedEntryIds.has(id)) {
      setLinkedEntryIds((prev) => new Set(prev).add(id))
    }
    setPrimaryEntryId(id)
  }

  function invalidateExpenseQueries(touchedEntryIds) {
    const ids = [...new Set((touchedEntryIds || []).filter(Boolean))]
    for (const id of ids) {
      qc.invalidateQueries({ queryKey: ['viaggio', 'entry-expenses', id] })
    }
    qc.invalidateQueries({ queryKey: ['viaggio', 'expenses', journey.id] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'expense'] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'expense-receipts'] })
  }

  async function handleAddReceiptFiles(files) {
    setError('')
    if (!canEdit) return
    if (expenseId) {
      setReceiptBusy(true)
      try {
        await uploadReceiptFiles(files, expenseId)
        await qc.invalidateQueries({ queryKey: receiptsQueryKey })
      } catch (err) {
        setError(err.message || 'Could not upload receipt.')
      } finally {
        setReceiptBusy(false)
      }
      return
    }
    setPendingReceipts((prev) => [...prev, ...files])
  }

  async function handleRemoveAttachment(att) {
    if (!canEdit || !att) return
    setError('')
    setReceiptBusy(true)
    try {
      await deleteAttachment(att)
      await qc.invalidateQueries({ queryKey: receiptsQueryKey })
    } catch (err) {
      setError(err.message || 'Could not remove receipt.')
    } finally {
      setReceiptBusy(false)
    }
  }

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

  const linksOk =
    linkedEntryIds.size === 0 ||
    (primaryEntryId && linkedEntryIds.has(primaryEntryId))

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!linksOk) throw new Error('Pick a primary activity for the links.')
      const entryIds =
        linkedEntryIds.size === 0
          ? []
          : [
              primaryEntryId,
              ...[...linkedEntryIds].filter((id) => id !== primaryEntryId),
            ]
      const saved = await upsertExpenseWithSplits({
        id: expenseId || null,
        journeyId: journey.id,
        entryId: primaryEntryId || null,
        entryIds,
        title,
        amountCents,
        currency,
        paidBy,
        splitMode,
        category: category || null,
        splits: computedSplits,
      })
      if (!expenseId && pendingReceipts.length > 0 && saved?.id) {
        await uploadReceiptFiles(pendingReceipts, saved.id)
      }
      return { saved, entryIds }
    },
    onSuccess: ({ entryIds: savedEntryIds }) => {
      const prev = initialEntryIds(existing, entryId)
      invalidateExpenseQueries([...prev, ...savedEntryIds, entryId])
      // Pop back — replace() was duplicating entry-edit on the stack.
      goBack()
    },
    onError: (err) => setError(err.message || 'Save failed'),
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteExpense(expenseId),
    onSuccess: () => {
      invalidateExpenseQueries([
        ...initialEntryIds(existing, entryId),
        ...linkedEntryIds,
        entryId,
      ])
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

  const headerTitle = viewOnly
    ? 'Expense'
    : expenseId
      ? 'Edit expense'
      : 'Add expense'

  return (
    <div className={styles.page}>
      <PageHeader
        title={headerTitle}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          viewOnly && membershipCanEdit && expenseId ? (
            <div className={styles.toolbar}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={() =>
                  replace('expense-edit', {
                    journeyId: journey.id,
                    entryId: entryId || undefined,
                    expenseId,
                  })
                }
                aria-label="Edit expense"
                title="Edit"
              >
                <Pencil size={14} aria-hidden="true" />
              </Button>
            </div>
          ) : canEdit ? (
            <div className={styles.toolbar}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                disabled={!splitOk || !linksOk || saveMut.isPending}
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                aria-label={saveMut.isPending ? 'Saving…' : 'Save expense'}
                title={saveMut.isPending ? 'Saving…' : 'Save expense'}
              >
                {saveMut.isPending ? (
                  <Loader2 size={14} aria-hidden="true" className={styles.spin} />
                ) : (
                  <Save size={14} aria-hidden="true" />
                )}
              </Button>
              {expenseId ? (
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
              ) : null}
            </div>
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
            {viewOnly
              ? 'Preview mode. Open Edit to make changes.'
              : 'You can view this expense. Only editors can change it.'}
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

          <div className={cx(styles.formSpan2)}>
            <p className={styles.sectionTitle}>Activities</p>
            <p className={styles.hint}>
              Optional. Link to one or more activities (star = primary for
              activity totals). None → journey expense.
            </p>
            <ActivityLinkChips
              entries={journeyEntries}
              selected={linkedEntryIds}
              primaryId={primaryEntryId}
              onToggle={toggleEntryLink}
              onSetPrimary={setPrimary}
              readOnly={!canEdit}
              displayLocale={displayLocale}
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
            <div
              className={styles.segmented}
              role="group"
              aria-label="Split mode"
            >
              <button
                type="button"
                className={cx(
                  styles.segment,
                  splitMode === 'equal' && styles.segmentActive,
                )}
                disabled={!canEdit}
                onClick={() => setSplitMode('equal')}
              >
                <Grid2x2Check size={14} aria-hidden="true" />
                Paying equally
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
                <Shapes size={14} aria-hidden="true" />
                Paying separately
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

          <div className={cx(styles.field, styles.formSpan2)}>
            {viewOnly ? (
              <>
                <p className={styles.sectionTitle}>Attachments</p>
                {receipts.length === 0 ? (
                  <p className={styles.hint}>No files linked to this expense.</p>
                ) : (
                  <ul className={styles.list}>
                    {receipts.map((att) => (
                      <li key={att.id}>
                        <AttachmentCard
                          attachment={att}
                          meta={formatByteSize(att.byteSize)}
                          onOpen={() =>
                            goAttachmentEdit({
                              journeyId: journey.id,
                              attachmentId: att.id,
                              expenseId,
                            })
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <ReceiptField
                pendingFiles={pendingReceipts}
                attachments={expenseId ? receipts : []}
                readOnly={!canEdit}
                busy={receiptBusy || saveMut.isPending}
                onAddFiles={handleAddReceiptFiles}
                onRemovePending={(idx) =>
                  setPendingReceipts((prev) => prev.filter((_, i) => i !== idx))
                }
                onRemoveAttachment={handleRemoveAttachment}
                onOpenAttachment={
                  expenseId
                    ? (att) =>
                        goAttachmentEdit({
                          journeyId: journey.id,
                          attachmentId: att.id,
                          expenseId,
                        })
                    : undefined
                }
              />
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

        </div>
      </div>
    </div>
  )
}
