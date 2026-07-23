import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Info,
  ListMusic,
  Plus,
  Settings,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { cx } from '@/lib/cx'
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
  labelForUserId,
} from '@/lib/format'
import {
  fetchDisplayNames,
  listEntries,
  listEntryParticipants,
  listExpensesForJourney,
  listJourneyPeople,
  myMembership,
  updateJourneyPacks,
  getJourney,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

function EntrySidePopover({ open, onClose, title, children, anchorRef }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return
      if (anchorRef?.current?.contains(e.target)) return
      onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div ref={panelRef} className={styles.entryPopover} role="dialog" aria-label={title}>
      <div className={styles.entryPopoverTitle}>{title}</div>
      {children}
    </div>
  )
}

function EntryRowActions({
  entry,
  entryExpenses,
  whoIds,
  peopleById,
  displayLocale,
  currentUserId,
  displayNames,
  canEdit,
  onOpenExpense,
  onAddExpense,
}) {
  const [panel, setPanel] = useState(null) // 'expenses' | 'people' | 'details' | null
  const expensesBtnRef = useRef(null)
  const peopleBtnRef = useRef(null)
  const detailsBtnRef = useRef(null)
  const showExpenses = entryExpenses.length > 0
  const showPeople = whoIds.length > 1
  const activity = getActivity(entry.activityId)
  const showUpdated =
    entry.updatedBy &&
    entry.updatedAt &&
    (entry.updatedBy !== entry.createdBy ||
      entry.updatedAt !== entry.createdAt)

  return (
    <div className={styles.rowActions}>
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
      <button
        ref={detailsBtnRef}
        type="button"
        className={styles.rowInfo}
        aria-label="Activity details"
        title="Activity details"
        aria-expanded={panel === 'details'}
        aria-haspopup="dialog"
        onClick={() => setPanel((p) => (p === 'details' ? null : 'details'))}
      >
        <Info size={16} aria-hidden="true" />
      </button>

      {showExpenses && (
        <EntrySidePopover
          open={panel === 'expenses'}
          onClose={() => setPanel(null)}
          title="Expenses"
          anchorRef={expensesBtnRef}
        >
          <ul className={styles.list}>
            {entryExpenses.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  className={styles.entryPopoverRow}
                  onClick={() => {
                    setPanel(null)
                    onOpenExpense(ex)
                  }}
                >
                  <span className={styles.entryPopoverName}>
                    {ex.title || 'Expense'}
                  </span>
                  <span className={styles.entryPopoverMeta}>
                    {formatMoney(ex.amountCents, ex.currency, displayLocale)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {canEdit && (
            <div className={styles.entryPopoverActions}>
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
        </EntrySidePopover>
      )}

      {showPeople && (
        <EntrySidePopover
          open={panel === 'people'}
          onClose={() => setPanel(null)}
          title="Participants"
          anchorRef={peopleBtnRef}
        >
          <ul className={styles.list}>
            {whoIds.map((pid) => (
              <li key={pid} className={styles.entryPopoverRow}>
                <span className={styles.entryPopoverName}>
                  {labelForJourneyPerson(
                    peopleById.get(pid) || { id: pid },
                    currentUserId,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </EntrySidePopover>
      )}

      <EntrySidePopover
        open={panel === 'details'}
        onClose={() => setPanel(null)}
        title="Details"
        anchorRef={detailsBtnRef}
      >
        <div className={styles.entryPopoverRow}>
          <span className={styles.entryPopoverName}>
            {entry.title || activity?.label || 'Activity'}
          </span>
          {activity?.label && entry.title && (
            <span className={styles.entryPopoverMeta}>{activity.label}</span>
          )}
        </div>
        <p className={styles.entryPopoverHint}>
          Created by{' '}
          {labelForUserId(entry.createdBy, currentUserId, displayNames)}
          {entry.createdAt
            ? ` · ${formatWhen(entry.createdAt, displayLocale)}`
            : ''}
        </p>
        {showUpdated && (
          <p className={styles.entryPopoverHint}>
            Updated by{' '}
            {labelForUserId(entry.updatedBy, currentUserId, displayNames)}
            {` · ${formatWhen(entry.updatedAt, displayLocale)}`}
          </p>
        )}
      </EntrySidePopover>
    </div>
  )
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
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()
  const qc = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [browse, setBrowse] = useState(false)
  const [packsOpen, setPacksOpen] = useState(false)

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
      setPacksOpen(false)
    },
  })

  function pickActivity(activityId) {
    setAddOpen(false)
    setBrowse(false)
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
              onClick={() => setAddOpen(true)}
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
                label: 'Members',
                icon: Users,
                pick: () => () => goMembers(journeyId),
              },
              {
                id: 'spending',
                label: 'Spending',
                icon: Wallet,
                pick: () => () => goSpending(journeyId),
              },
              {
                id: 'playlist',
                label: 'Playlist',
                icon: ListMusic,
                pick: () => () => goPlaylist(journeyId),
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
              <Button onClick={() => setAddOpen(true)}>
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
                const meta = [
                  activity?.label,
                  formatEntryTimeLine(entry, displayLocale),
                  entry.placeName,
                  moneyHint,
                  whoHint,
                ]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <li key={entry.id} className={styles.entryRow}>
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
                        displayNames={displayNames}
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
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.rowMetaBtn}
                      onClick={openEntry}
                    >
                      <span className={styles.rowMeta}>{meta}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        open={addOpen}
        onDismiss={() => setAddOpen(false)}
        title="Add activity"
        wide
      >
        <div className={styles.sheet}>
          {!browse && (
            <>
              <p className={styles.sectionTitle}>Primary</p>
              <div className={styles.chipRow}>
                {primaryIds.map((id) => {
                  const a = getActivity(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      className={styles.chip}
                      onClick={() => pickActivity(id)}
                    >
                      {a?.label || id}
                    </button>
                  )
                })}
              </div>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPacksOpen(true)}
                >
                  Also include…
                </Button>
              )}
              <Button variant="secondary" onClick={() => setBrowse(true)}>
                Browse all
              </Button>
            </>
          )}
          {browse && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setBrowse(false)}>
                ← Primary
              </Button>
              <ul className={styles.list}>
                {ACTIVITIES.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className={styles.rowBtn}
                      onClick={() => pickActivity(a.id)}
                    >
                      <span className={styles.rowBody}>
                        <span className={styles.rowTitle}>{a.label}</span>
                        <span className={styles.rowMeta}>{a.schema}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={packsOpen}
        onDismiss={() => setPacksOpen(false)}
        title="Activity packs"
      >
        <PackPicker
          journey={journey}
          onSave={(packs) => packsMut.mutate(packs)}
          saving={packsMut.isPending}
        />
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
