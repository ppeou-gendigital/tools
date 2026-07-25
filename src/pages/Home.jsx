import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, List, MapPinned, Plus, Users } from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import popoverStyles from '@/molecules/AnchoredPopover.module.scss'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { cx } from '@/lib/cx'
import { getPreset } from '@/lib/catalog'
import { formatWallDate, labelForJourneyPerson } from '@/lib/format'
import { classifyJourney, todayUtcDate } from '@/lib/journeyStatus'
import { listJourneys, listJourneyPeople } from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import pageStyles from './Page.module.scss'
import styles from './Home.module.scss'

const LAYOUT_KEY = 'viaggio.homeLayout'

/** Re-export for callers that imported from Home. */
export { classifyJourney }

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
  const { data: roster = [], isLoading, error } = useQuery({
    queryKey: ['viaggio', 'journey-people', journey.id],
    queryFn: () => listJourneyPeople(journey.id),
    enabled: open,
  })

  return (
    <AnchoredPopover
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      title="Travelers"
      role="list"
      aria-label={`Travelers for ${journey.title}`}
    >
      {isLoading && <p className={popoverStyles.hint}>Loading…</p>}
      {error && (
        <p className={popoverStyles.hint}>Could not load travelers.</p>
      )}
      {!isLoading && !error && roster.length === 0 && (
        <p className={popoverStyles.hint}>No travelers yet.</p>
      )}
      {!isLoading && !error && roster.length > 0 && (
        <ul className={popoverStyles.list}>
          {roster.map((p) => (
            <li key={p.id} className={popoverStyles.row} role="listitem">
              <span className={popoverStyles.name}>
                {labelForJourneyPerson(p, currentUserId)}
              </span>
              <span className={popoverStyles.meta}>
                {p.linkedUserId ? 'Joined' : 'Guest'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </AnchoredPopover>
  )
}

function JourneyCard({ journey, locale, layout, onOpen, currentUserId }) {
  const [peopleOpen, setPeopleOpen] = useState(false)
  const peopleBtnRef = useRef(null)
  const isTile = layout === 'tiles'

  return (
    <div className={cx(styles.card, isTile && styles.tileCard)}>
      <button
        type="button"
        className={styles.cardMain}
        onClick={() => onOpen(journey.id)}
      >
        {!isTile && (
          <MapPinned
            size={16}
            className={styles.cardIcon}
            aria-hidden="true"
          />
        )}
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
          aria-label={`Travelers for ${journey.title}`}
          aria-haspopup="dialog"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={nav.goJourneyCreate}
              className={pageStyles.iconBtn}
              aria-label="New journey"
              title="New journey"
            >
              <Plus size={14} aria-hidden="true" />
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
          <div className={pageStyles.empty}>
            <p className={pageStyles.error}>
              Could not load journeys. ({error.message})
            </p>
            <Button variant="outline" onClick={() => refetch()} fullWidth>
              Retry
            </Button>
          </div>
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
              className={
                layout === 'tiles'
                  ? styles.tileGrid
                  : cx(pageStyles.list, styles.listGrid)
              }
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
      </div>
    </div>
  )
}
