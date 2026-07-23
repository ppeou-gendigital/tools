import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { RichNoteEditor } from '@/molecules/RichNoteEditor'
import { TimezoneAutocomplete } from '@/molecules/TimezoneAutocomplete'
import { PageHeader } from '@/patterns/PageHeader'
import {
  defaultParticipantMode,
  getActivity,
  getSchema,
  isDualZoneSchema,
  resolveSchemaForActivity,
} from '@/lib/catalog'
import { parseRichBody, serializeRichBody } from '@/lib/richBody'
import {
  formatMoney,
  formatWhen,
  labelForJourneyPerson,
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

  const saveMut = useMutation({
    mutationFn: () => {
      const startTz = dualZone
        ? startTimezone || defaultTz
        : timezone || defaultTz
      const endTz = dualZone ? endTimezone || defaultTz : timezone || defaultTz
      const occursAt = wallTimeToUtcIso(occursAtLocal, startTz)
      const endsAt = wallTimeToUtcIso(endsAtLocal, endTz)
      const payload = {
        id: entryId || null,
        journeyId: journey.id,
        activityId,
        schema: schemaId,
        title,
        body: parseRichBody(body),
        occursOn: occursOn || null,
        occursAt,
        endsAt,
        placeName: placeName || null,
        address: address || null,
        details,
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
        title={activity?.label || 'Activity'}
        subtitle={readOnly ? 'View only' : entryId ? 'Edit activity' : 'New activity'}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />

      <div className={cx('is-fluid-width', styles.body)}>
        <div className={styles.form}>
          {readOnly && (
            <p className={styles.readOnlyBanner}>
              You can view this activity but not edit it.
            </p>
          )}
          {fields.has('title') && (
            <div className={styles.field}>
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
            <div className={styles.dualZone}>
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
                <div className={styles.field}>
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
            <div className={styles.field}>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                disabled={readOnly}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          {(activity?.detailHints || []).map((hint) => (
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

          {fields.has('body') && (
            <div className={styles.field}>
              <Label>Notes</Label>
              <RichNoteEditor
                value={body}
                onChange={setBody}
                disabled={readOnly}
              />
            </div>
          )}

          <p className={styles.sectionTitle}>Participants</p>
          {roster.length === 0 ? (
            <p className={styles.hint}>
              No travelers on this journey yet. Add them under Travelers.
            </p>
          ) : (
            <ul className={styles.list}>
              {roster.map((p) => (
                <li key={p.id}>
                  <label className={styles.rowBtn}>
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      disabled={readOnly}
                      onChange={() => toggleUser(p.id)}
                    />
                    <span className={styles.rowBody}>
                      <span className={styles.rowTitle}>
                        {labelForJourneyPerson(p, user?.id)}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {error && <p className={styles.error}>{error}</p>}

          {!readOnly && (
            <div className={styles.actionsSticky}>
              <Button
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                disabled={saveMut.isPending}
              >
                {saveMut.isPending ? 'Saving…' : 'Save'}
              </Button>
              {entryId && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('Delete this activity?')) {
                      deleteMut.mutate()
                    }
                  }}
                  disabled={deleteMut.isPending}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              )}
            </div>
          )}

          {existing && (
            <p className={styles.hint}>
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
            <section className={styles.form}>
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
