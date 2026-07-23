import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, List, MapPinned, Plus, Users } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { cx } from '@/lib/cx'
import { getPreset } from '@/lib/catalog'
import { formatWallDate, labelForJourneyPerson } from '@/lib/format'
import { listJourneys, listJourneyPeople } from '@/lib/viaggioApi'
import { LoadingState } from '@/molecules/LoadingState'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import pageStyles from './Page.module.scss'
import styles from './Home.module.scss'

const LAYOUT_KEY = 'viaggio.homeLayout'

function todayUtcDate() {
  const now = new Date()
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  )
}

function parseOn(isoDate) {
  if (!isoDate) return null
  // startsOn / endsOn are calendar dates (YYYY-MM-DD)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate))
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

/**
 * current  — ongoing (no dates) or today is within [startsOn, endsOn]
 * upcoming — starts after today
 * past     — ended before today
 */
export function classifyJourney(journey, today = todayUtcDate()) {
  const start = parseOn(journey.startsOn)
  const end = parseOn(journey.endsOn)

  if (!start && !end) return 'current'
  if (start && start.getTime() > today.getTime()) return 'upcoming'
  if (end && end.getTime() < today.getTime()) return 'past'
  return 'current'
}

function formatJourneyDate(isoDate, locale) {
  if (!isoDate) return ''
  return formatWallDate(isoDate, 'UTC', locale).replace(/^[A-Za-z]{3},\s*/, '')
}

function journeyMeta(j, locale) {
  const preset = getPreset(j.preset)
  const bits = [
    j.type === 'trip' ? 'Trip' : 'Journal',
    preset?.label,
  ].filter(Boolean)
  if (j.startsOn || j.endsOn) {
    bits.push(
      [j.startsOn, j.endsOn]
        .filter(Boolean)
        .map((d) => formatJourneyDate(d, locale))
        .join(' → '),
    )
  } else {
    bits.push('Ongoing')
  }
  return bits.join(' · ')
}

function readLayout() {
  try {
    const v = localStorage.getItem(LAYOUT_KEY)
    return v === 'tiles' ? 'tiles' : 'list'
  } catch {
    return 'list'
  }
}

const SECTIONS = [
  { id: 'current', title: 'Current' },
  { id: 'upcoming', title: 'Upcoming' },
  { id: 'past', title: 'Past' },
]

function sortSection(id, items) {
  const copy = [...items]
  if (id === 'upcoming') {
    copy.sort((a, b) => String(a.startsOn || '').localeCompare(String(b.startsOn || '')))
  } else if (id === 'past') {
    copy.sort((a, b) =>
      String(b.endsOn || b.startsOn || '').localeCompare(
        String(a.endsOn || a.startsOn || ''),
      ),
    )
  } else {
    copy.sort((a, b) =>
      String(a.startsOn || '').localeCompare(String(b.startsOn || '')) ||
      String(a.title || '').localeCompare(String(b.title || '')),
    )
  }
  return copy
}

function ParticipantsPopover({ journey, currentUserId, open, onClose, anchorRef }) {
  const panelRef = useRef(null)
  const { data: roster = [], isLoading, error } = useQuery({
    queryKey: ['viaggio', 'journey-people', journey.id],
    queryFn: () => listJourneyPeople(journey.id),
    enabled: open,
  })

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return
      if (anchorRef.current?.contains(e.target)) return
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
    <ul
      ref={panelRef}
      className={styles.peoplePopover}
      role="listbox"
      aria-label={`Travelers for ${journey.title}`}
    >
      <li className={styles.peoplePopoverTitle} role="presentation">
        Travelers
      </li>
      {isLoading && (
        <li>
          <p className={styles.peopleHint}>Loading…</p>
        </li>
      )}
      {error && (
        <li>
          <p className={styles.peopleHint}>Could not load travelers.</p>
        </li>
      )}
      {!isLoading &&
        !error &&
        roster.map((p) => (
          <li key={p.id} className={styles.peopleRow} role="option">
            <span className={styles.peopleName}>
              {labelForJourneyPerson(p, currentUserId)}
            </span>
            <span className={styles.peopleRole}>
              {p.linkedUserId ? 'Has account' : 'Guest'}
            </span>
          </li>
        ))}
      {!isLoading && !error && roster.length === 0 && (
        <li>
          <p className={styles.peopleHint}>No travelers yet.</p>
        </li>
      )}
    </ul>
  )
}

function JourneyCard({ journey, locale, layout, onOpen, currentUserId }) {
  const [peopleOpen, setPeopleOpen] = useState(false)
  const peopleBtnRef = useRef(null)

  return (
    <div className={cx(styles.card, layout === 'tiles' && styles.tileCard)}>
      <button
        type="button"
        className={styles.cardMain}
        onClick={() => onOpen(journey.id)}
      >
        <MapPinned size={16} className={styles.cardIcon} aria-hidden="true" />
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{journey.title}</span>
          <span className={styles.cardMeta}>
            {journeyMeta(journey, locale)}
          </span>
        </span>
      </button>
      <div className={styles.peopleWrap}>
        <button
          ref={peopleBtnRef}
          type="button"
          className={styles.peopleBtn}
          aria-label={`Participants for ${journey.title}`}
          aria-haspopup="listbox"
          aria-expanded={peopleOpen}
          onClick={(e) => {
            e.stopPropagation()
            setPeopleOpen((v) => !v)
          }}
        >
          <Users size={16} aria-hidden="true" />
        </button>
        <ParticipantsPopover
          journey={journey}
          currentUserId={currentUserId}
          open={peopleOpen}
          onClose={() => setPeopleOpen(false)}
          anchorRef={peopleBtnRef}
        />
      </div>
    </div>
  )
}

export function Home() {
  const nav = useNavigation()
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()
  const [layout, setLayout] = useState(readLayout)
  const { data: journeys = [], isLoading, error, refetch } = useQuery({
    queryKey: ['viaggio', 'journeys'],
    queryFn: listJourneys,
  })

  const sections = useMemo(() => {
    const today = todayUtcDate()
    const buckets = { current: [], upcoming: [], past: [] }
    for (const j of journeys) {
      buckets[classifyJourney(j, today)].push(j)
    }
    return SECTIONS.map((s) => ({
      ...s,
      items: sortSection(s.id, buckets[s.id]),
    })).filter((s) => s.items.length > 0)
  }, [journeys])

  function setLayoutMode(next) {
    setLayout(next)
    try {
      localStorage.setItem(LAYOUT_KEY, next)
    } catch {
      // ignore
    }
  }

  return (
    <div className={pageStyles.page}>
      <PageHeader
        title="Your journeys"
        subtitle="Trips and journals you share with others."
        actions={
          <>
            <div
              className={styles.layoutToggle}
              role="group"
              aria-label="Journey layout"
            >
              <button
                type="button"
                className={cx(
                  styles.layoutBtn,
                  layout === 'list' && styles.layoutBtnActive,
                )}
                aria-pressed={layout === 'list'}
                aria-label="List view"
                onClick={() => setLayoutMode('list')}
              >
                <List size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={cx(
                  styles.layoutBtn,
                  layout === 'tiles' && styles.layoutBtnActive,
                )}
                aria-pressed={layout === 'tiles'}
                aria-label="Tile view"
                onClick={() => setLayoutMode('tiles')}
              >
                <LayoutGrid size={14} aria-hidden="true" />
              </button>
            </div>
            <Button size="sm" onClick={nav.goJourneyCreate}>
              <Plus size={14} aria-hidden="true" />
              New
            </Button>
          </>
        }
        shortcuts={
          <PageShortcuts current="home" className={pageStyles.iconBtn} />
        }
      />

      <div className={cx('is-fluid-width', pageStyles.body)}>
        {isLoading && <LoadingState>Loading journeys…</LoadingState>}
        {error && (
          <p className={pageStyles.error}>
            Could not load journeys. Run the SQL schema in Supabase if tables
            are missing. ({error.message})
          </p>
        )}

        {!isLoading && !error && journeys.length === 0 && (
          <div className={pageStyles.empty}>
            <p>Plan a trip or start a journal.</p>
            <Button onClick={nav.goJourneyCreate}>
              <Plus size={14} aria-hidden="true" />
              New journey
            </Button>
          </div>
        )}

        {sections.map((section) => (
          <section key={section.id} className={styles.section}>
            <h2 className={pageStyles.sectionTitle}>{section.title}</h2>
            <ul
              className={layout === 'tiles' ? styles.tileGrid : pageStyles.list}
            >
              {section.items.map((j) => (
                <li
                  key={j.id}
                  className={layout === 'tiles' ? styles.tileItem : undefined}
                >
                  <JourneyCard
                    journey={j}
                    locale={displayLocale}
                    layout={layout}
                    onOpen={nav.goJourney}
                    currentUserId={user?.id}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {error && (
          <Button variant="outline" onClick={() => refetch()} fullWidth>
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
