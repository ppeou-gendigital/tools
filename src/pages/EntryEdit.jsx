import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { AirlineAutocomplete } from '@/molecules/AirlineAutocomplete'
import { ParticipantChips } from '@/molecules/ParticipantChips'
import { RichNoteEditor } from '@/molecules/RichNoteEditor'
import { TimezoneAutocomplete } from '@/molecules/TimezoneAutocomplete'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import {
  defaultParticipantMode,
  getActivity,
  getSchema,
  isDualZoneSchema,
  resolveSchemaForActivity,
} from '@/lib/catalog'
import {
  normalizeFlightDetails,
  suggestFlightTitle,
} from '@/lib/flightIdentity'
import { parseRichBody, serializeRichBody } from '@/lib/richBody'
import {
  formatMoney,
  formatWhen,
  labelForUserId,
} from '@/lib/format'
import { utcIsoToWallTime, wallTimeToUtcIso } from '@/lib/timezone'
import {
  deleteEntry,
  fetchDisplayNames,
  getEntry,
  getJourney,
  listExpensesForEntry,
  listJourneyPeople,
  listParticipantsForEntry,
  myMembership,
  upsertEntry,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function EntryEdit() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goExpenseEdit,
    goHome,
    replace,
  } = useNavigation()
  const { journeyId, entryId, activityId: paramActivityId } = params
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

  const { data: existing, isLoading: entryLoading } = useQuery({
    queryKey: ['viaggio', 'entry', entryId],
    queryFn: () => getEntry(entryId),
    enabled: !!entryId,
  })

  const { data: expenses = [] } = useQuery({
    queryKey: ['viaggio', 'entry-expenses', entryId],
    queryFn: () => listExpensesForEntry(entryId),
    enabled: !!entryId,
  })

  const { data: roster = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const { data: participantIds = [], isLoading: participantsLoading } =
    useQuery({
      queryKey: ['viaggio', 'entry-participants', entryId],
      queryFn: () => listParticipantsForEntry(entryId),
      enabled: !!entryId,
    })

  const activityId = existing?.activityId || paramActivityId
  const stillLoading =
    journeyLoading ||
    rosterLoading ||
    (!!entryId && (entryLoading || participantsLoading))
  const missing =
    !stillLoading &&
    (!journey || (entryId && !existing) || (!entryId && !activityId))
  const ready =
    !!journeyId &&
    !!activityId &&
    !!journey &&
    !journeyLoading &&
    !rosterLoading &&
    (!entryId || (!entryLoading && !participantsLoading && existing))

  if (!journeyId || (!paramActivityId && !entryId)) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing activity context.</p>
        </div>
      </div>
    )
  }

  if (stillLoading || (!ready && !missing)) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Activity"
          leading={
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={14} />
              {previousRouteLabel ?? 'Back'}
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading activity…</LoadingState>
        </div>
      </div>
    )
  }

  if (missing) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Activity"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>
            This activity was not found, or you no longer have access.
          </p>
          <Button onClick={goHome} fullWidth>
            Back to journeys
          </Button>
        </div>
      </div>
    )
  }

  return (
    <EntryEditForm
      key={entryId || `new-${activityId}`}
      journey={journey}
      existing={existing || null}
      entryId={entryId || null}
      activityId={activityId}
      expenses={expenses}
      roster={roster}
      participantIds={participantIds}
      membership={membership}
      user={user}
      displayLocale={displayLocale}
      goBack={goBack}
      previousRouteLabel={previousRouteLabel}
      goExpenseEdit={goExpenseEdit}
      replace={replace}
    />
  )
}

function EntryEditForm({
  journey,
  existing,
  entryId,
  activityId,
  expenses,
  roster,
  participantIds,
  membership,
  user,
  displayLocale,
  goBack,
  previousRouteLabel,
  goExpenseEdit,
  replace,
}) {
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const activity = getActivity(activityId)
  const schemaId = activity
    ? resolveSchemaForActivity(activityId)
    : existing?.schema
  const schema = getSchema(schemaId)
  const dualZone = isDualZoneSchema(schemaId)
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const readOnly = !canEdit
  const fields = useMemo(() => new Set(schema?.fields ?? []), [schema])
  const defaultTz = journey.defaultTimezone || ''

  const [title, setTitle] = useState(existing?.title || '')
  const [placeName, setPlaceName] = useState(existing?.placeName || '')
  const [address, setAddress] = useState(existing?.address || '')
  const [occursOn, setOccursOn] = useState(existing?.occursOn || '')
  const [timezone, setTimezone] = useState(existing?.timezone || defaultTz)
  const [startTimezone, setStartTimezone] = useState(
    existing?.startTimezone || existing?.timezone || defaultTz,
  )
  const [endTimezone, setEndTimezone] = useState(
    existing?.endTimezone || existing?.timezone || defaultTz,
  )
  const initialStartTz =
    existing?.startTimezone || existing?.timezone || defaultTz
  const initialEndTz = existing?.endTimezone || existing?.timezone || defaultTz
  const initialTz = existing?.timezone || defaultTz
  const [occursAtLocal, setOccursAtLocal] = useState(() =>
    utcIsoToWallTime(
      existing?.occursAt,
      dualZone ? initialStartTz : initialTz,
    ),
  )
  const [endsAtLocal, setEndsAtLocal] = useState(() =>
    utcIsoToWallTime(existing?.endsAt, dualZone ? initialEndTz : initialTz),
  )
  const [details, setDetails] = useState(existing?.details || {})
  const [body, setBody] = useState(() =>
    serializeRichBody(parseRichBody(existing?.body).doc),
  )
  const [selected, setSelected] = useState(() => {
    if (existing) return new Set(participantIds)
    if (defaultParticipantMode(activityId) === 'all') {
      return new Set(roster.map((p) => p.id))
    }
    return new Set()
  })

  const authorIds = useMemo(() => {
    if (!existing) return []
    return [existing.createdBy, existing.updatedBy].filter(Boolean)
  }, [existing])

  const { data: authorNames = new Map() } = useQuery({
    queryKey: ['viaggio', 'display-names', authorIds],
    queryFn: () => fetchDisplayNames(authorIds),
    enabled: authorIds.length > 0,
  })

  function toggleUser(userId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const isFlight = activityId === 'flight'
  const flightHintKeys = new Set(['airline', 'flight_number', 'confirmation'])
  const genericHints = (activity?.detailHints || []).filter((hint) =>
    isFlight ? !flightHintKeys.has(hint.key) : true,
  )

  const saveMut = useMutation({
    mutationFn: () => {
      const startTz = dualZone
        ? startTimezone || defaultTz
        : timezone || defaultTz
      const endTz = dualZone ? endTimezone || defaultTz : timezone || defaultTz
      const occursAt = wallTimeToUtcIso(occursAtLocal, startTz)
      const endsAt = wallTimeToUtcIso(endsAtLocal, endTz)
      const savedDetails = isFlight
        ? normalizeFlightDetails(details)
        : details
      let savedTitle = title
      if (isFlight && !String(savedTitle || '').trim()) {
        savedTitle = suggestFlightTitle(savedDetails)
      }
      const payload = {
        id: entryId || null,
        journeyId: journey.id,
        activityId,
        schema: schemaId,
        title: savedTitle,
        body: parseRichBody(body),
        occursOn: occursOn || null,
        occursAt,
        endsAt,
        placeName: placeName || null,
        address: address || null,
        details: savedDetails,
        participantIds: [...selected],
      }
      if (dualZone) {
        payload.startTimezone = startTimezone || null
        payload.endTimezone = endTimezone || null
        payload.timezone = endTimezone || startTimezone || timezone || null
      } else {
        payload.timezone =
          occursAt || endsAt ? timezone || journey.defaultTimezone : null
      }
      return upsertEntry(payload)
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'entries', journey.id] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'entry', row.id] })
      qc.invalidateQueries({
        queryKey: ['viaggio', 'entry-participants', row.id],
      })
      qc.invalidateQueries({
        queryKey: ['viaggio', 'journey-participants', journey.id],
      })
      qc.invalidateQueries({
        queryKey: ['viaggio', 'journey-people', journey.id],
      })
      if (!entryId) {
        replace('entry-edit', {
          journeyId: journey.id,
          entryId: row.id,
          activityId,
        })
      } else {
        goBack()
      }
    },
    onError: (err) => setError(err.message || 'Save failed'),
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteEntry(entryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'entries', journey.id] })
      qc.invalidateQueries({
        queryKey: ['viaggio', 'journey-participants', journey.id],
      })
      replace('journey', { journeyId: journey.id })
    },
    onError: (err) => setError(err.message || 'Delete failed'),
  })

  return (
    <div className={styles.page}>
      <PageHeader
        title={title.trim() || activity?.label || 'Activity'}
        subtitle={
          readOnly
            ? 'View only'
            : entryId
              ? activity?.label || 'Edit activity'
              : 'New activity'
        }
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          !readOnly ? (
            <div className={styles.toolbar}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                disabled={saveMut.isPending}
                aria-label={saveMut.isPending ? 'Saving…' : 'Save activity'}
                title={saveMut.isPending ? 'Saving…' : 'Save activity'}
              >
                {saveMut.isPending ? (
                  <Loader2 size={14} aria-hidden="true" className={styles.spin} />
                ) : (
                  <Save size={14} aria-hidden="true" />
                )}
              </Button>
              {entryId ? (
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
        title="Delete activity?"
        message="This removes the activity and its linked expenses. This cannot be undone."
        confirmLabel="Delete"
        confirming={deleteMut.isPending}
        onConfirm={() => deleteMut.mutate()}
      />

      <div className={cx('is-fluid-width', styles.body)}>
        <div className={cx(styles.form, styles.formNarrow, styles.formGrid)}>
          {readOnly && (
            <p className={cx(styles.readOnlyBanner, styles.formSpan2)}>
              You can view this activity but not edit it.
            </p>
          )}
          {fields.has('title') && (
            <div className={cx(styles.field, styles.formSpan2)}>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                disabled={readOnly}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          {fields.has('occurs_on') && (
            <div className={styles.field}>
              <Label htmlFor="occursOn">Date</Label>
              <Input
                id="occursOn"
                type="date"
                value={occursOn}
                disabled={readOnly}
                onChange={(e) => setOccursOn(e.target.value)}
              />
            </div>
          )}

          {dualZone ? (
            <div className={cx(styles.dualZone, styles.formSpan2)}>
              <div className={styles.block}>
                <p className={styles.blockTitle}>Depart / pickup</p>
                <div className={styles.field}>
                  <Label htmlFor="startAt">Time</Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={occursAtLocal}
                    disabled={readOnly}
                    onChange={(e) => setOccursAtLocal(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="startTz">Timezone</Label>
                  <TimezoneAutocomplete
                    id="startTz"
                    value={startTimezone}
                    disabled={readOnly}
                    onChange={setStartTimezone}
                  />
                </div>
              </div>
              <div className={styles.block}>
                <p className={styles.blockTitle}>Arrive / dropoff</p>
                <div className={styles.field}>
                  <Label htmlFor="endAt">Time</Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={endsAtLocal}
                    disabled={readOnly}
                    onChange={(e) => setEndsAtLocal(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="endTz">Timezone</Label>
                  <TimezoneAutocomplete
                    id="endTz"
                    value={endTimezone}
                    disabled={readOnly}
                    onChange={setEndTimezone}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {(fields.has('occurs_at') || fields.has('ends_at')) && (
                <div className={cx(styles.field, styles.formSpan2)}>
                  <Label htmlFor="tz">Timezone</Label>
                  <TimezoneAutocomplete
                    id="tz"
                    value={timezone}
                    disabled={readOnly}
                    onChange={setTimezone}
                  />
                  <p className={styles.hint}>
                    Times below are wall clocks in this zone.
                  </p>
                </div>
              )}
              {fields.has('occurs_at') && (
                <div className={styles.field}>
                  <Label htmlFor="occursAt">Starts</Label>
                  <Input
                    id="occursAt"
                    type="datetime-local"
                    value={occursAtLocal}
                    disabled={readOnly}
                    onChange={(e) => setOccursAtLocal(e.target.value)}
                  />
                </div>
              )}
              {fields.has('ends_at') && (
                <div className={styles.field}>
                  <Label htmlFor="endsAt">Ends</Label>
                  <Input
                    id="endsAt"
                    type="datetime-local"
                    value={endsAtLocal}
                    disabled={readOnly}
                    onChange={(e) => setEndsAtLocal(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {fields.has('place_name') && (
            <div className={styles.field}>
              <Label htmlFor="place">Place</Label>
              <Input
                id="place"
                value={placeName}
                disabled={readOnly}
                onChange={(e) => setPlaceName(e.target.value)}
              />
            </div>
          )}

          {fields.has('address') && (
            <div className={cx(styles.field, styles.formSpan2)}>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                disabled={readOnly}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          {isFlight && (
            <>
              <div className={styles.field}>
                <Label htmlFor="d-airline">Airline</Label>
                <AirlineAutocomplete
                  id="d-airline"
                  value={details.airline || ''}
                  disabled={readOnly}
                  onChange={(iata) =>
                    setDetails((prev) => ({ ...prev, airline: iata }))
                  }
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="d-flight_number">Flight number</Label>
                <Input
                  id="d-flight_number"
                  value={details.flight_number || ''}
                  disabled={readOnly}
                  placeholder="440 or TP440"
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      flight_number: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="d-confirmation">Confirmation #</Label>
                <Input
                  id="d-confirmation"
                  value={details.confirmation || ''}
                  disabled={readOnly}
                  placeholder="Optional"
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      confirmation: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          {genericHints.map((hint) => (
            <div className={styles.field} key={hint.key}>
              <Label htmlFor={`d-${hint.key}`}>{hint.label}</Label>
              <Input
                id={`d-${hint.key}`}
                value={details[hint.key] || ''}
                disabled={readOnly}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    [hint.key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}

          <div className={styles.formSpan2}>
            <p className={styles.sectionTitle}>Participants</p>
            <ParticipantChips
              roster={roster}
              selected={selected}
              onToggle={toggleUser}
              currentUserId={user?.id}
              readOnly={readOnly}
            />
          </div>

          {fields.has('body') && (
            <div className={cx(styles.field, styles.formSpan2)}>
              <Label>Notes</Label>
              <RichNoteEditor
                value={body}
                onChange={setBody}
                disabled={readOnly}
              />
            </div>
          )}

          {error && (
            <p className={cx(styles.error, styles.formSpan2)} role="alert">
              {error}
            </p>
          )}

          {existing && (
            <p className={cx(styles.hint, styles.formSpan2)}>
              Created by{' '}
              {labelForUserId(existing.createdBy, user?.id, authorNames)}
              {existing.createdAt
                ? ` · ${formatWhen(existing.createdAt, displayLocale)}`
                : ''}
              {existing.updatedBy &&
                existing.updatedAt &&
                (existing.updatedBy !== existing.createdBy ||
                  existing.updatedAt !== existing.createdAt) && (
                  <>
                    <br />
                    Updated by{' '}
                    {labelForUserId(existing.updatedBy, user?.id, authorNames)}
                    {` · ${formatWhen(existing.updatedAt, displayLocale)}`}
                  </>
                )}
            </p>
          )}

          {entryId && (
            <section className={styles.formSpan2}>
              <p className={styles.sectionTitle}>Expenses on this activity</p>
              {expenses.length === 0 && (
                <p className={styles.hint}>No expenses yet.</p>
              )}
              <ul className={styles.list}>
                {expenses.map((ex) => (
                  <li key={ex.id}>
                    <button
                      type="button"
                      className={styles.rowBtn}
                      onClick={() =>
                        goExpenseEdit({
                          journeyId: journey.id,
                          entryId,
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
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={() =>
                    goExpenseEdit({ journeyId: journey.id, entryId })
                  }
                >
                  <Plus size={14} />
                  Add expense
                </Button>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
