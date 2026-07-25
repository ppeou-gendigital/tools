import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarSync,
  CircleDollarSign,
  Grid2x2Check,
  ListChecks,
  ListMusic,
  Loader2,
  MapPin,
  Plus,
  Settings,
  Shapes,
  Users,
  Wallet,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { cx } from '@/lib/cx'
import { activityIcon } from '@/lib/activityIcons'
import {
  ACTIVITIES,
  PRESETS,
  getActivity,
  getPreset,
  primaryActivityIds,
} from '@/lib/catalog'
import {
  entryDayKey,
  formatEntryTimeLine,
  formatMoney,
  formatParticipantHint,
  formatWallDate,
  formatWhen,
  labelForJourneyPerson,
  labelForSplitMode,
  labelForUserId,
} from '@/lib/format'
import {
  applyFlightStatusToEntry,
  fetchFlightStatus,
  flightLookupFromEntry,
  formatFlightStatusDetails,
  formatFlightStatusLine,
} from '@/lib/flightStatus'
import {
  fetchDisplayNames,
  listEntries,
  listEntryParticipants,
  listExpensesForJourney,
  listJourneyPeople,
  myMembership,
  updateJourneyPacks,
  upsertEntry,
  getJourney,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

function EntryRowActions({
  entry,
  entryExpenses,
  whoIds,
  peopleById,
  displayLocale,
  currentUserId,
  canEdit,
  onOpenExpense,
  onAddExpense,
  onRefreshFlight,
}) {
  const [panel, setPanel] = useState(null) // 'expenses' | 'people' | 'flight' | null
  const [flightBusy, setFlightBusy] = useState(false)
  const [flightError, setFlightError] = useState('')
  const [flightStatus, setFlightStatus] = useState(null)
  const expensesBtnRef = useRef(null)
  const peopleBtnRef = useRef(null)
  const flightBtnRef = useRef(null)
  // Editors always get Wallet so they can add the first expense from the row.
  const showExpenses = canEdit || entryExpenses.length > 0
  const showPeople = whoIds.length > 1
  const flightLookup = flightLookupFromEntry(entry)
  const showFlight = canEdit && entry?.activityId === 'flight'

  async function handleFlightRefresh() {
    if (flightBusy) return
    setPanel('flight')
    setFlightStatus(null)
    setFlightError('')
    if (!flightLookup) {
      setFlightError(
        'Add airline (IATA) and flight number on this activity to refresh status.',
      )
      return
    }
    setFlightBusy(true)
    try {
      const status = await fetchFlightStatus(flightLookup, { force: true })
      setFlightStatus(status)
      await onRefreshFlight?.(entry, status)
    } catch (err) {
      setFlightError(err?.message || 'Could not refresh flight status')
    } finally {
      setFlightBusy(false)
    }
  }

  const flightDetailRows = formatFlightStatusDetails(
    flightStatus || entry?.details,
  )

  return (
    <div className={styles.rowActions}>
      {showFlight && (
        <button
          ref={flightBtnRef}
          type="button"
          className={styles.rowInfo}
          aria-label="Refresh flight status"
          title="Refresh flight status"
          aria-expanded={panel === 'flight'}
          aria-haspopup="dialog"
          disabled={flightBusy}
          onClick={() => {
            if (panel === 'flight') {
              setPanel(null)
              return
            }
            handleFlightRefresh()
          }}
        >
          {flightBusy ? (
            <Loader2 size={16} className={styles.spin} aria-hidden="true" />
          ) : (
            <CalendarSync size={16} aria-hidden="true" />
          )}
        </button>
      )}
      {showExpenses && (
        <button
          ref={expensesBtnRef}
          type="button"
          className={styles.rowInfo}
          aria-label="Expenses"
          title="Expenses"
          aria-expanded={panel === 'expenses'}
          aria-haspopup="dialog"
          onClick={() =>
            setPanel((p) => (p === 'expenses' ? null : 'expenses'))
          }
        >
          <Wallet size={16} aria-hidden="true" />
        </button>
      )}
      {showPeople && (
        <button
          ref={peopleBtnRef}
          type="button"
          className={styles.rowInfo}
          aria-label="Participants"
          title="Participants"
          aria-expanded={panel === 'people'}
          aria-haspopup="dialog"
          onClick={() => setPanel((p) => (p === 'people' ? null : 'people'))}
        >
          <Users size={16} aria-hidden="true" />
        </button>
      )}

      {showFlight && (
        <AnchoredPopover
          open={panel === 'flight'}
          onClose={() => setPanel(null)}
          title="Flight status"
          anchorRef={flightBtnRef}
        >
          {flightBusy && !flightStatus ? (
            <p className={popoverStyles.hint}>Checking live status…</p>
          ) : null}
          {flightError ? (
            <p className={popoverStyles.hint}>{flightError}</p>
          ) : null}
          {!flightBusy && !flightError && flightDetailRows.length === 0 ? (
            <p className={popoverStyles.hint}>No status available.</p>
          ) : null}
          {flightDetailRows.length > 0 && (
            <ul className={popoverStyles.list}>
              {flightDetailRows.map((row) => (
                <li key={row.label} className={popoverStyles.row}>
                  <span className={popoverStyles.name}>{row.label}</span>
                  <span className={popoverStyles.meta}>{row.value}</span>
                </li>
              ))}
            </ul>
          )}
        </AnchoredPopover>
      )}

      {showExpenses && (
        <AnchoredPopover
          open={panel === 'expenses'}
          onClose={() => setPanel(null)}
          title="Expenses"
          anchorRef={expensesBtnRef}
        >
          {entryExpenses.length === 0 ? (
            <p className={popoverStyles.hint}>No expenses yet.</p>
          ) : (
            <ul className={popoverStyles.list}>
              {entryExpenses.map((ex) => (
                <li key={ex.id}>
                  <button
                    type="button"
                    className={popoverStyles.row}
                    onClick={() => {
                      setPanel(null)
                      onOpenExpense(ex)
                    }}
                  >
                    <span className={popoverStyles.name}>
                      {ex.title || 'Expense'}
                      <span
                        className={popoverStyles.splitHint}
                        role="img"
                        aria-label={labelForSplitMode(ex.splitMode)}
                        title={labelForSplitMode(ex.splitMode)}
                      >
                        {ex.splitMode === 'custom' ? (
                          <Shapes size={12} aria-hidden="true" />
                        ) : (
                          <Grid2x2Check size={12} aria-hidden="true" />
                        )}
                      </span>
                    </span>
                    <span className={popoverStyles.meta}>
                      {formatMoney(ex.amountCents, ex.currency, displayLocale)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {canEdit && (
            <div className={popoverStyles.actions}>
              <Button
                size="sm"
                variant="outline"
                fullWidth
                onClick={() => {
                  setPanel(null)
                  onAddExpense()
                }}
              >
                <Plus size={14} aria-hidden="true" />
                Add expense
              </Button>
            </div>
          )}
        </AnchoredPopover>
      )}

      {showPeople && (
        <AnchoredPopover
          open={panel === 'people'}
          onClose={() => setPanel(null)}
          title="Participants"
          anchorRef={peopleBtnRef}
        >
          <ul className={popoverStyles.list}>
            {whoIds.map((pid) => (
              <li key={pid} className={popoverStyles.row}>
                <span className={popoverStyles.name}>
                  {labelForJourneyPerson(
                    peopleById.get(pid) || { id: pid },
                    currentUserId,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </AnchoredPopover>
      )}
    </div>
  )
}

function entryProvenance(entry, currentUserId, displayNames, displayLocale) {
  const showUpdated =
    entry.updatedBy &&
    entry.updatedAt &&
    (entry.updatedBy !== entry.createdBy ||
      entry.updatedAt !== entry.createdAt)
  if (showUpdated) {
    return `Updated by ${labelForUserId(entry.updatedBy, currentUserId, displayNames)}${
      entry.updatedAt ? ` · ${formatWhen(entry.updatedAt, displayLocale)}` : ''
    }`
  }
  if (!entry.createdBy && !entry.createdAt) return ''
  return `Created by ${labelForUserId(entry.createdBy, currentUserId, displayNames)}${
    entry.createdAt ? ` · ${formatWhen(entry.createdAt, displayLocale)}` : ''
  }`
}

export function Journey() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goEntryEdit,
    goExpenseEdit,
    goMembers,
    goSpending,
    goPlaylist,
    goTodos,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()
  const qc = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [addStep, setAddStep] = useState('main') // 'main' | 'browse' | 'packs'

  const { data: journey, isLoading } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['viaggio', 'entries', journeyId],
    queryFn: () => listEntries(journeyId),
    enabled: !!journeyId,
  })

  const { data: expenses = [] } = useQuery({
    queryKey: ['viaggio', 'expenses', journeyId],
    queryFn: () => listExpensesForJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: participantRows = [] } = useQuery({
    queryKey: ['viaggio', 'journey-participants', journeyId],
    queryFn: () => listEntryParticipants(journeyId),
    enabled: !!journeyId,
  })

  const { data: roster = [] } = useQuery({
    queryKey: ['viaggio', 'journey-people', journeyId],
    queryFn: () => listJourneyPeople(journeyId),
    enabled: !!journeyId,
  })

  const peopleById = useMemo(() => {
    const map = new Map()
    for (const p of roster) map.set(p.id, p)
    return map
  }, [roster])

  const participantsByEntry = useMemo(() => {
    const map = new Map()
    for (const row of participantRows) {
      const list = map.get(row.entryId) || []
      list.push(row.journeyPersonId)
      map.set(row.entryId, list)
    }
    return map
  }, [participantRows])

  const labelUserIds = useMemo(() => {
    const ids = []
    for (const entry of entries) {
      if (entry.createdBy) ids.push(entry.createdBy)
      if (entry.updatedBy) ids.push(entry.updatedBy)
    }
    return [...new Set(ids)]
  }, [entries])

  const { data: displayNames = new Map() } = useQuery({
    queryKey: ['viaggio', 'display-names', journeyId, labelUserIds],
    queryFn: () => fetchDisplayNames(labelUserIds),
    enabled: labelUserIds.length > 0,
  })

  const canEdit = membership?.role === 'owner' || membership?.role === 'editor'

  async function refreshFlightEntry(entry, status) {
    const patch = applyFlightStatusToEntry(entry, status)
    await upsertEntry({
      id: entry.id,
      journeyId: entry.journeyId,
      activityId: entry.activityId,
      schema: entry.schema,
      title: entry.title,
      body: entry.body ?? {},
      occursOn: entry.occursOn,
      occursAt: patch.occursAt,
      endsAt: patch.endsAt,
      timezone: entry.timezone,
      startTimezone: entry.startTimezone,
      endTimezone: entry.endTimezone,
      placeName: entry.placeName,
      address: entry.address,
      lat: entry.lat,
      lng: entry.lng,
      phoneE164: entry.phoneE164,
      contactId: entry.contactId,
      details: patch.details,
      participantIds: participantsByEntry.get(entry.id) || [],
    })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entries', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entry', entry.id] })
  }
  const preset = getPreset(journey?.preset)
  const primaryIds = useMemo(
    () => (journey ? primaryActivityIds(journey) : []),
    [journey],
  )

  const expenseByEntry = useMemo(() => {
    const map = new Map()
    for (const e of expenses) {
      const list = map.get(e.entryId) || []
      list.push(e)
      map.set(e.entryId, list)
    }
    return map
  }, [expenses])

  const grouped = useMemo(() => {
    const groups = new Map()
    for (const entry of entries) {
      const key = entryDayKey(entry)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(entry)
    }
    return [...groups.entries()]
  }, [entries])

  const packsMut = useMutation({
    mutationFn: (packs) => updateJourneyPacks(journeyId, packs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'journey', journeyId] })
      setAddStep('main')
    },
  })

  function openAdd() {
    setAddStep('main')
    setAddOpen(true)
  }

  function pickActivity(activityId) {
    setAddOpen(false)
    setAddStep('main')
    goEntryEdit({ journeyId, activityId })
  }

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing journey.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={journey?.title || (isLoading ? '…' : 'Journey')}
        subtitle={preset?.emptyState && entries.length === 0 ? preset.emptyState : undefined}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit ? (
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtn}
              onClick={openAdd}
              aria-label="Add activity"
              title="Add activity"
            >
              <Plus size={14} aria-hidden="true" />
            </Button>
          ) : null
        }
        shortcuts={
          <PageShortcuts
            current="journey"
            className={styles.iconBtn}
            shortcuts={[
              {
                id: 'members',
                label: 'Travelers',
                icon: Users,
                pick: () => () => goMembers(journeyId),
              },
              {
                id: 'spending',
                label: 'Spending',
                icon: CircleDollarSign,
                pick: () => () => goSpending(journeyId),
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
        {(isLoading || entriesLoading) && (
          <LoadingState>Loading journey…</LoadingState>
        )}
        {!isLoading && !entriesLoading && entries.length === 0 && (
          <div className={styles.empty}>
            <p>{preset?.emptyState || 'No activities yet.'}</p>
            {canEdit && (
              <Button onClick={openAdd}>
                <Plus size={14} />
                Add activity
              </Button>
            )}
          </div>
        )}

        {grouped.map(([day, dayEntries]) => (
          <div key={day}>
            <div className={styles.dayHeader}>
              {day === 'undated'
                ? 'Undated'
                : formatWallDate(day, null, displayLocale)}
            </div>
            <ul className={styles.list}>
              {dayEntries.map((entry) => {
                const activity = getActivity(entry.activityId)
                const entryExpenses = expenseByEntry.get(entry.id) || []
                const moneyHint = entryExpenses
                  .map((x) => formatMoney(x.amountCents, x.currency, displayLocale))
                  .join(' · ')
                const whoIds = participantsByEntry.get(entry.id) || []
                const whoHint = formatParticipantHint(whoIds)
                const openEntry = () =>
                  goEntryEdit({
                    journeyId,
                    entryId: entry.id,
                    activityId: entry.activityId,
                  })
                const title =
                  entry.title || activity?.label || 'Activity'
                const ActivityIcon = activityIcon(entry.activityId)
                const metaPrimary = [
                  activity?.label,
                  formatEntryTimeLine(entry, displayLocale),
                  entry.placeName,
                ]
                  .filter(Boolean)
                  .join(' · ')
                const metaSecondary = [moneyHint, whoHint]
                  .filter(Boolean)
                  .join(' · ')
                const flightStatusLine = formatFlightStatusLine(entry.details)
                const provenance = entryProvenance(
                  entry,
                  user?.id,
                  displayNames,
                  displayLocale,
                )
                return (
                  <li key={entry.id} className={styles.entryRow}>
                    <span
                      className={styles.entryIcon}
                      aria-hidden="true"
                      title={activity?.label || 'Activity'}
                    >
                      <ActivityIcon size={18} strokeWidth={1.75} />
                    </span>
                    <div className={styles.entryMain}>
                      <div className={styles.entryHeader}>
                        <button
                          type="button"
                          className={styles.rowTitleBtn}
                          onClick={openEntry}
                        >
                          <span className={styles.rowTitle}>{title}</span>
                        </button>
                        <EntryRowActions
                          entry={entry}
                          entryExpenses={entryExpenses}
                          whoIds={whoIds}
                          peopleById={peopleById}
                          displayLocale={displayLocale}
                          currentUserId={user?.id}
                          canEdit={canEdit}
                          onOpenExpense={(ex) =>
                            goExpenseEdit({
                              journeyId,
                              entryId: entry.id,
                              expenseId: ex.id,
                            })
                          }
                          onAddExpense={() =>
                            goExpenseEdit({
                              journeyId,
                              entryId: entry.id,
                            })
                          }
                          onRefreshFlight={refreshFlightEntry}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.rowMetaBtn}
                        onClick={openEntry}
                      >
                        <span className={styles.rowMeta}>
                          {metaPrimary}
                          {flightStatusLine ? (
                            <>
                              {metaPrimary && <br />}
                              <span className={styles.flightStatus}>
                                {flightStatusLine}
                              </span>
                            </>
                          ) : null}
                          {metaSecondary ? (
                            <>
                              {(metaPrimary ||
                                flightStatusLine ||
                                provenance) && <br />}
                              {metaSecondary}
                            </>
                          ) : null}
                          {provenance ? (
                            <>
                              {(metaPrimary || metaSecondary) && <br />}
                              <span className={styles.rowMetaQuiet}>
                                {provenance}
                              </span>
                            </>
                          ) : null}
                        </span>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        open={addOpen}
        onDismiss={() => {
          setAddOpen(false)
          setAddStep('main')
        }}
        title={
          addStep === 'packs'
            ? 'Activity packs'
            : addStep === 'browse'
              ? 'All activities'
              : 'Add activity'
        }
        wide={addStep !== 'packs'}
      >
        <div className={styles.sheet}>
          {addStep === 'main' && (
            <>
              <p className={styles.sectionTitle}>Primary</p>
              <div className={styles.chipRow}>
                {primaryIds.map((id) => {
                  const a = getActivity(id)
                  const ChipIcon = activityIcon(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      className={styles.chip}
                      onClick={() => pickActivity(id)}
                    >
                      <ChipIcon size={14} aria-hidden="true" />
                      {a?.label || id}
                    </button>
                  )
                })}
              </div>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddStep('packs')}
                >
                  Also include…
                </Button>
              )}
              <Button variant="secondary" onClick={() => setAddStep('browse')}>
                Browse all
              </Button>
            </>
          )}
          {addStep === 'browse' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddStep('main')}
              >
                ← Primary
              </Button>
              <ul className={styles.list}>
                {ACTIVITIES.map((a) => {
                  const BrowseIcon = activityIcon(a.id)
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        className={styles.rowBtn}
                        onClick={() => pickActivity(a.id)}
                      >
                        <span className={styles.entryIcon} aria-hidden="true">
                          <BrowseIcon size={18} strokeWidth={1.75} />
                        </span>
                        <span className={styles.rowBody}>
                          <span className={styles.rowTitle}>{a.label}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          {addStep === 'packs' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddStep('main')}
              >
                ← Back
              </Button>
              <PackPicker
                journey={journey}
                onSave={(packs) => packsMut.mutate(packs)}
                saving={packsMut.isPending}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

function PackPicker({ journey, onSave, saving }) {
  const [selected, setSelected] = useState(
    () => new Set(journey?.activityPacks ?? []),
  )

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const others = PRESETS.filter((p) => p.id !== journey?.preset)

  return (
    <div className={styles.sheet}>
      <p className={styles.hint}>
        Merge another preset’s primary activities into your Add menu.
      </p>
      <ul className={styles.list}>
        {others.map((p) => (
          <li key={p.id}>
            <label className={styles.rowBtn}>
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
              />
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{p.label}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <Button onClick={() => onSave([...selected])} disabled={saving} fullWidth>
        {saving ? 'Saving…' : 'Save packs'}
      </Button>
    </div>
  )
}
