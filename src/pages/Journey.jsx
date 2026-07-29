import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CircleDollarSign,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  EllipsisVertical,
  ExternalLink,
  Grid2x2Check,
  ListChecks,
  ListMusic,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Paperclip,
  Plane,
  Route,
  Plus,
  Settings,
  Shapes,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
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
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import {
  entryDayKey,
  entryCheckoutDayKey,
  entryEndDayCloneSchema,
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
import { openMapsPlaceUrl, openMapsRouteUrl } from '@/lib/mapsLinks'
import {
  allGeoWaypoints,
  resolveTimelineContext,
} from '@/lib/timelineContext'
import {
  CACHE_TTL_MS as WEATHER_CACHE_TTL_MS,
  fetchWeatherForEntries,
  formatWeatherChip,
  temperatureUnitFromLocale,
  weatherIconKind,
  weatherLookupFromEntry,
} from '@/lib/weather'
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
  displayNames,
  displayLocale,
  currentUserId,
  canEdit,
  onOpenExpense,
  onAddExpense,
  onRefreshFlight,
  placeUrl,
  placeTitle,
  mapsUrl,
  mapsTitle,
}) {
  const [panel, setPanel] = useState(null) // 'menu' | 'expenses' | 'people' | 'flight' | null
  const [flightBusy, setFlightBusy] = useState(false)
  const [flightError, setFlightError] = useState('')
  const [flightStatus, setFlightStatus] = useState(null)
  const menuBtnRef = useRef(null)
  // Editors always get Wallet so they can add the first expense from the row.
  const showExpenses = canEdit || entryExpenses.length > 0
  const showPeople = whoIds.length > 1
  const flightLookup = flightLookupFromEntry(entry)
  const showFlight = canEdit && entry?.activityId === 'flight'
  const showPlace = Boolean(placeUrl)
  const showMaps = Boolean(mapsUrl)
  const hasActions =
    showFlight || showExpenses || showPeople || showPlace || showMaps

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

  if (!hasActions) return null

  return (
    <div className={styles.rowActions}>
      <button
        ref={menuBtnRef}
        type="button"
        className={styles.rowInfo}
        aria-label="Activity actions"
        title="Activity actions"
        aria-expanded={panel != null}
        aria-haspopup="menu"
        disabled={flightBusy && panel === 'flight'}
        onClick={() => setPanel((p) => (p === 'menu' ? null : 'menu'))}
      >
        {flightBusy && panel === 'flight' ? (
          <Loader2 size={16} className={styles.spin} aria-hidden="true" />
        ) : (
          <EllipsisVertical size={16} aria-hidden="true" />
        )}
      </button>

      <AnchoredPopover
        open={panel === 'menu'}
        onClose={() => setPanel(null)}
        anchorRef={menuBtnRef}
        align="end"
        fluid
        role="menu"
        aria-label="Activity actions"
      >
        <ul className={styles.rowActionMenu}>
          {showFlight && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.rowActionMenuItem}
                disabled={flightBusy}
                onClick={() => handleFlightRefresh()}
              >
                <Plane size={16} aria-hidden="true" />
                <span>Flight status</span>
              </button>
            </li>
          )}
          {showExpenses && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.rowActionMenuItem}
                onClick={() => setPanel('expenses')}
              >
                <CircleDollarSign size={16} aria-hidden="true" />
                <span>Expenses</span>
              </button>
            </li>
          )}
          {showPeople && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.rowActionMenuItem}
                onClick={() => setPanel('people')}
              >
                <Users size={16} aria-hidden="true" />
                <span>Participants</span>
              </button>
            </li>
          )}
          {showPlace && (
            <li role="none">
              <a
                role="menuitem"
                className={styles.rowActionMenuItem}
                href={placeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setPanel(null)}
              >
                <MapIcon size={16} aria-hidden="true" />
                <span>{placeTitle || 'Open location in Maps'}</span>
              </a>
            </li>
          )}
          {showMaps && (
            <li role="none">
              <a
                role="menuitem"
                className={styles.rowActionMenuItem}
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setPanel(null)}
              >
                <Route size={16} aria-hidden="true" />
                <span>{mapsTitle || 'Open in Maps'}</span>
              </a>
            </li>
          )}
        </ul>
      </AnchoredPopover>

      {showFlight && (
        <AnchoredPopover
          open={panel === 'flight'}
          onClose={() => setPanel(null)}
          title="Flight status"
          anchorRef={menuBtnRef}
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
          anchorRef={menuBtnRef}
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
          anchorRef={menuBtnRef}
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

function WeatherIcon({ kind, size = 14 }) {
  const props = { size, strokeWidth: 1.75, 'aria-hidden': true }
  if (kind === 'sun') return <Sun {...props} />
  if (kind === 'cloud-sun') return <CloudSun {...props} />
  if (kind === 'fog') return <CloudFog {...props} />
  if (kind === 'drizzle') return <CloudDrizzle {...props} />
  if (kind === 'rain') return <CloudRain {...props} />
  if (kind === 'snow') return <CloudSnow {...props} />
  if (kind === 'storm') return <CloudLightning {...props} />
  return <Cloud {...props} />
}

const WEATHER_LEGEND = [
  { kind: 'sun', label: 'Clear' },
  { kind: 'cloud-sun', label: 'Partly cloudy' },
  { kind: 'cloud', label: 'Overcast' },
  { kind: 'fog', label: 'Fog' },
  { kind: 'rain', label: 'Rain' },
  { kind: 'snow', label: 'Snow' },
  { kind: 'storm', label: 'Storm' },
]

function entryProvenance(entry, currentUserId, displayNames, displayLocale) {
  const showUpdated =
    entry.updatedBy &&
    entry.updatedAt &&
    (entry.updatedBy !== entry.createdBy ||
      entry.updatedAt !== entry.createdAt)
  if (showUpdated) {
    if (currentUserId && entry.updatedBy === currentUserId) return ''
    return `Updated by ${labelForUserId(entry.updatedBy, currentUserId, displayNames)}${
      entry.updatedAt ? ` · ${formatWhen(entry.updatedAt, displayLocale)}` : ''
    }`
  }
  if (!entry.createdBy && !entry.createdAt) return ''
  if (currentUserId && entry.createdBy === currentUserId) return ''
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
    goAttachments,
    goMembers,
    goSpending,
    goPlaylist,
    goTodos,
    goMap,
    goJourneySettings,
    goAiPlanner,
  } = useNavigation()
  const journeyId = params.journeyId
  const aiEnabled = isAiPlanningEnabled()
  const { user } = useAuth()
  const { displayLocale, mapsProvider } = useDisplayPrefs()
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

  const weatherRequestKey = useMemo(() => {
    if (!journey) return ''
    return entries
      .map((e) => weatherLookupFromEntry(e, journey)?.key)
      .filter(Boolean)
      .sort()
      .join(',')
  }, [entries, journey])

  const { data: weatherByKey = {} } = useQuery({
    queryKey: ['viaggio', 'weather', journeyId, weatherRequestKey],
    queryFn: () => fetchWeatherForEntries(entries, journey),
    enabled: !!journeyId && !!journey && !!weatherRequestKey,
    staleTime: WEATHER_CACHE_TTL_MS,
    refetchOnWindowFocus: true,
  })

  const showWeatherLegend = Object.keys(weatherByKey).length > 0

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

  const peopleById = useMemo(() => {
    const map = new Map()
    for (const p of roster) map.set(p.id, p)
    return map
  }, [roster])

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
      const ids =
        e.entryIds?.length > 0
          ? e.entryIds
          : e.entryId
            ? [e.entryId]
            : []
      for (const eid of ids) {
        const list = map.get(eid) || []
        list.push(e)
        map.set(eid, list)
      }
    }
    return map
  }, [expenses])

  const grouped = useMemo(() => {
    const groups = new Map()
    const push = (key, entry) => {
      if (!key) return
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(entry)
    }
    for (const entry of entries) {
      push(entryDayKey(entry), entry)
      // Lodging checkout / rental drop-off only (never transit).
      const checkoutKey = entryCheckoutDayKey(entry)
      if (checkoutKey) {
        push(checkoutKey, { ...entry, timelineRole: 'checkout' })
      }
    }
    for (const [, dayEntries] of groups) {
      dayEntries.sort((a, b) => {
        const ta =
          a.timelineRole === 'checkout'
            ? a.endsAt || ''
            : a.occursAt || a.occursOn || ''
        const tb =
          b.timelineRole === 'checkout'
            ? b.endsAt || ''
            : b.occursAt || b.occursOn || ''
        return String(ta).localeCompare(String(tb))
      })
    }
    return [...groups.entries()].sort(([a], [b]) => {
      if (a === 'undated') return 1
      if (b === 'undated') return -1
      return a.localeCompare(b)
    })
  }, [entries])

  const timelineCtx = useMemo(
    () => resolveTimelineContext({ journey, entries }),
    [journey, entries],
  )
  const supposedId = timelineCtx.supposedEntry?.id || null
  const showSupposed =
    timelineCtx.phase === 'current' && Boolean(supposedId)
  const tripGeo = useMemo(() => allGeoWaypoints(entries), [entries])
  const tripMapUrl = useMemo(
    () =>
      openMapsRouteUrl(tripGeo, {
        provider: mapsProvider,
        // Trip overview: first pinned stop → last (not device location).
        // Current location (e.g. Texas) → Europe cannot be driven in Maps.
        fromCurrentLocation: false,
      }),
    [tripGeo, mapsProvider],
  )
  const tripGeoIndexById = useMemo(() => {
    const map = new Map()
    tripGeo.forEach((entry, index) => {
      map.set(entry.id, index)
    })
    return map
  }, [tripGeo])

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
            <div className={styles.toolbar}>
              {aiEnabled && (
                <AiPlannerButton
                  journeyId={journeyId}
                  className={styles.iconBtn}
                />
              )}
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
            </div>
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
                id: 'attachments',
                label: 'Attachments',
                icon: Paperclip,
                pick: () => () => goAttachments(journeyId),
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
            {canEdit && aiEnabled && (
              <Button variant="outline" onClick={() => goAiPlanner(journeyId)}>
                <Sparkles size={14} />
                Improve with AI
              </Button>
            )}
          </div>
        )}

        {!isLoading && !entriesLoading && tripMapUrl ? (
          <div className={styles.tripRouteBar} aria-label="Trip route">
            <span className={styles.tripRouteLabel}>
              <Navigation size={14} aria-hidden="true" />
              Route · {tripGeo.length} pinned stop
              {tripGeo.length === 1 ? '' : 's'}
            </span>
            <a
              className={styles.dayRouteLink}
              href={tripMapUrl}
              target="_blank"
              rel="noreferrer"
              title={`Open route in ${mapsProvider === 'apple' ? 'Apple' : 'Google'} Maps`}
            >
              Map
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          </div>
        ) : null}

        {!isLoading && !entriesLoading && showWeatherLegend ? (
          <div className={styles.weatherLegend} aria-label="Weather legend">
            <span className={styles.weatherLegendLabel}>Weather</span>
            <span className={styles.weatherLegendSep} aria-hidden="true">
              ·
            </span>
            <ul className={styles.weatherLegendList}>
              {WEATHER_LEGEND.map((item) => (
                <li
                  key={item.kind}
                  className={styles.weatherLegendItem}
                  data-kind={item.kind}
                >
                  <span className={styles.entryWeatherIcon}>
                    <WeatherIcon kind={item.kind} size={14} />
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {grouped.map(([day, dayEntries]) => {
          const isToday =
            showSupposed && day === timelineCtx.todayKey
          return (
          <div key={day}>
            <div
              className={cx(
                styles.dayHeader,
                isToday && styles.dayHeaderToday,
              )}
            >
              <span className={styles.dayHeaderLabel}>
                {day === 'undated'
                  ? 'Undated'
                  : formatWallDate(day, null, displayLocale)}
                {isToday ? (
                  <span className={styles.dayTodayBadge}>Today</span>
                ) : null}
              </span>
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
                const isEndClone = entry.timelineRole === 'checkout'
                const endCloneSchema = isEndClone
                  ? entryEndDayCloneSchema(entry)
                  : null
                const endCloneLabel =
                  endCloneSchema === 'rental' ? 'Drop-off' : 'Checkout'
                const title = isEndClone
                  ? `${endCloneLabel} · ${entry.title || activity?.label || (endCloneSchema === 'rental' ? 'Rental' : 'Stay')}`
                  : entry.title || activity?.label || 'Activity'
                const ActivityIcon = activityIcon(entry.activityId)
                const metaPrimary = [
                  isEndClone ? endCloneLabel : activity?.label,
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
                const isSupposed = showSupposed && entry.id === supposedId
                const supposedLabel =
                  timelineCtx.supposedKind === 'next' ? 'Next' : 'Now'
                const geoIndex = tripGeoIndexById.get(entry.id)
                const mapsAppLabel =
                  mapsProvider === 'apple' ? 'Apple' : 'Google'
                const placeUrl = openMapsPlaceUrl(entry, {
                  provider: mapsProvider,
                })
                const placeMapsUrl =
                  geoIndex != null
                    ? openMapsRouteUrl(tripGeo.slice(geoIndex), {
                        provider: mapsProvider,
                        fromCurrentLocation: true,
                      })
                    : null
                const weatherLookup = weatherLookupFromEntry(entry, journey)
                const weather = weatherLookup
                  ? weatherByKey[weatherLookup.key]
                  : null
                const weatherLabel = formatWeatherChip(weather, {
                  locale: displayLocale,
                })
                const weatherKind = weatherIconKind(weather?.weatherCode)
                const weatherSummary = weather?.summary
                  ? String(weather.summary)
                  : ''
                const placeTitle = placeUrl
                  ? `Open location in ${mapsAppLabel} Maps`
                  : ''
                const mapsTitle = placeMapsUrl
                  ? `Route from here through later stops in ${mapsAppLabel} Maps`
                  : ''
                return (
                  <li
                    key={
                      entry.timelineRole === 'checkout'
                        ? `${entry.id}:checkout`
                        : entry.id
                    }
                    className={cx(
                      styles.entryRow,
                      styles.entryRowTimeline,
                      weatherLabel && styles.entryRowHasWeather,
                      isSupposed && styles.entryRowSupposed,
                    )}
                  >
                    <span
                      className={styles.entryIconFlat}
                      aria-hidden="true"
                      title={activity?.label || 'Activity'}
                    >
                      <ActivityIcon size={32} strokeWidth={1.75} />
                    </span>
                    <div className={styles.entryMain}>
                      <div className={styles.entryTitle}>
                        <button
                          type="button"
                          className={styles.rowTitleBtn}
                          onClick={openEntry}
                        >
                          <span className={styles.rowTitle}>{title}</span>
                        </button>
                        {isSupposed ? (
                          <span className={styles.supposedBadge}>
                            {supposedLabel}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={cx(styles.rowMetaBtn, styles.entryMeta)}
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
                    <div className={styles.entryActions}>
                      <EntryRowActions
                        entry={entry}
                        entryExpenses={entryExpenses}
                        whoIds={whoIds}
                        peopleById={peopleById}
                        displayNames={displayNames}
                        displayLocale={displayLocale}
                        currentUserId={user?.id}
                        canEdit={canEdit}
                        placeUrl={placeUrl}
                        placeTitle={placeTitle}
                        mapsUrl={placeMapsUrl}
                        mapsTitle={mapsTitle}
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
                    {weatherLabel ? (
                      <div
                        className={styles.entryWeather}
                        title={
                          weatherSummary
                            ? `${weatherSummary} · daily high / low`
                            : 'Daily forecast high / low'
                        }
                        data-unit={temperatureUnitFromLocale(displayLocale)}
                        data-kind={weatherKind}
                      >
                        <span className={styles.entryWeatherIcon}>
                          <WeatherIcon kind={weatherKind} size={28} />
                        </span>
                        <span className={styles.entryWeatherTemps}>
                          {weatherLabel}
                        </span>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
          )
        })}
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
