import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Calendar,
  CalendarDays,
  HeartPulse,
  LayoutGrid,
  LayoutList,
  Pill,
  Stethoscope,
} from 'lucide-react'
import { cx } from '@/lib/cx'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { PatientSwitcher } from '@/patterns/PatientSwitcher'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import {
  listAppointments,
  listMedications,
  listReadings,
  listVisits,
} from '@/lib/doctoApi'
import { buildReminders } from '@/lib/reminders'
import styles from './Home.module.scss'

const HOME_LAYOUT_KEY = 'docto:homeLayout'

function readHomeLayout() {
  try {
    const v = localStorage.getItem(HOME_LAYOUT_KEY)
    return v === 'tiles' ? 'tiles' : 'list'
  } catch {
    return 'list'
  }
}

export function Home() {
  const vault = usePatientVault()
  const nav = useNavigation()
  const name = vault.patient?.preferredName || 'there'
  const roleNote =
    vault.role === 'helper'
      ? ' · Can help'
      : vault.role === 'viewer'
        ? ' · Can view'
        : ''
  const [appointments, setAppointments] = useState([])
  const [recentVisits, setRecentVisits] = useState([])
  const [medications, setMedications] = useState([])
  const [readingCount, setReadingCount] = useState(0)
  const [error, setError] = useState(null)
  const [layout, setLayout] = useState(readHomeLayout)

  const reload = useCallback(async () => {
    const key = vault.getKey()
    if (!vault.patientId || !key) return
    const [appts, visits, meds, readings] = await Promise.all([
      listAppointments(vault.patientId, key),
      listVisits(vault.patientId, key),
      listMedications(vault.patientId, key),
      listReadings(vault.patientId, key),
    ])
    setAppointments(appts)
    setRecentVisits(visits.slice(0, 5))
    setMedications(meds)
    setReadingCount(readings.length)
  }, [vault])

  useEffect(() => {
    reload().catch((e) => setError(e.message))
  }, [reload])

  useEffect(() => {
    if (typeof location === 'undefined') return
    const match = location.hash.match(/invite=([^&]+)/)
    if (!match) return
    if (typeof history !== 'undefined') {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
    }
    try {
      sessionStorage.setItem('docto.pendingInvite', decodeURIComponent(match[1]))
    } catch {
      // ignore
    }
    nav.goFamily()
  }, [nav])

  function changeLayout(next) {
    const value = next === 'tiles' ? 'tiles' : 'list'
    setLayout(value)
    try {
      localStorage.setItem(HOME_LAYOUT_KEY, value)
    } catch {
      // ignore
    }
  }

  const reminders = useMemo(
    () => buildReminders({ appointments, medications }),
    [appointments, medications],
  )

  const upcoming = useMemo(() => {
    const now = Date.now()
    return appointments
      .filter(
        (a) =>
          a.status === 'scheduled' &&
          new Date(a.startsAt).getTime() >= now - 60_000,
      )
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
      .slice(0, 5)
  }, [appointments])

  const timeline = useMemo(() => {
    const items = [
      ...upcoming.map((a) => ({
        id: `a-${a.id}`,
        at: new Date(a.startsAt).getTime(),
        label: a.title || a.kind,
        meta: new Date(a.startsAt).toLocaleString(),
        kind: 'appointment',
        go: nav.goAppointments,
      })),
      ...recentVisits.map((v) => ({
        id: `v-${v.id}`,
        at: new Date(`${v.visitDate}T12:00:00`).getTime(),
        label: v.title || 'Visit',
        meta: v.visitDate,
        kind: 'visit',
        go: nav.goVisits,
      })),
    ]
    return items.sort((a, b) => b.at - a.at).slice(0, 8)
  }, [upcoming, recentVisits, nav])

  const medCount = medications.filter((m) => m.isActive).length
  const isTiles = layout === 'tiles'
  const itemsClass = isTiles ? styles.tileGrid : styles.list

  const layoutToggle = (
    <div className={styles.layoutToggle} role="group" aria-label="Home layout">
      <button
        type="button"
        className={cx(styles.layoutBtn, !isTiles && styles.layoutBtnActive)}
        onClick={() => changeLayout('list')}
        aria-pressed={!isTiles}
        aria-label="List layout"
        title="List"
      >
        <LayoutList size={14} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cx(styles.layoutBtn, isTiles && styles.layoutBtnActive)}
        onClick={() => changeLayout('tiles')}
        aria-pressed={isTiles}
        aria-label="Tiles layout"
        title="Tiles"
      >
        <LayoutGrid size={14} aria-hidden="true" />
      </button>
    </div>
  )

  return (
    <div className={styles.page}>
      <PageHeader
        title="Home"
        subtitle={`Hi, ${name} — care timeline${roleNote}.`}
        actions={layoutToggle}
        shortcuts={
          <PageShortcuts current="home" className={styles.iconBtn} />
        }
      />

      <div className={styles.body}>
        <PatientSwitcher />
        {error && <p className={styles.empty}>{error}</p>}

        {reminders.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>
                <Bell size={14} aria-hidden="true" /> Reminders
              </h2>
            </div>
            <ul className={itemsClass}>
              {reminders.map((r) => (
                <li key={r.id} className={isTiles ? styles.tileItem : undefined}>
                  <button
                    type="button"
                    className={cx(styles.card, isTiles && styles.tileCard)}
                    data-urgency={r.urgency}
                    onClick={() => nav[r.go]?.()}
                  >
                    <Bell size={16} className={styles.cardIcon} aria-hidden="true" />
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{r.title}</span>
                      <span className={styles.cardMeta}>{r.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Timeline</h2>
          </div>
          {timeline.length === 0 ? (
            <p className={styles.empty}>
              Nothing on your timeline yet. Add an appointment or visit.
            </p>
          ) : (
            <ul className={itemsClass}>
              {timeline.map((item) => (
                <li key={item.id} className={isTiles ? styles.tileItem : undefined}>
                  <button
                    type="button"
                    className={cx(styles.card, isTiles && styles.tileCard)}
                    onClick={item.go}
                  >
                    {item.kind === 'appointment' ? (
                      <Calendar size={16} className={styles.cardIcon} aria-hidden="true" />
                    ) : (
                      <CalendarDays size={16} className={styles.cardIcon} aria-hidden="true" />
                    )}
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{item.label}</span>
                      <span className={styles.cardMeta}>
                        {item.kind === 'appointment' ? 'Appointment' : 'Visit'}
                        {' · '}
                        {item.meta}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick look</h2>
          <div className={styles.grid}>
            <button type="button" className={styles.stat} onClick={nav.goMedications}>
              <div className={styles.statIcon}>
                <Pill size={16} aria-hidden="true" />
              </div>
              <div className={styles.statBody}>
                <span className={styles.statLabel}>Active meds</span>
                <span className={styles.statValue}>{medCount}</span>
              </div>
            </button>
            <button type="button" className={styles.stat} onClick={nav.goReadings}>
              <div className={styles.statIcon}>
                <HeartPulse size={16} aria-hidden="true" />
              </div>
              <div className={styles.statBody}>
                <span className={styles.statLabel}>Readings</span>
                <span className={styles.statValue}>{readingCount}</span>
              </div>
            </button>
            <button type="button" className={styles.stat} onClick={nav.goDoctors}>
              <div className={styles.statIcon}>
                <Stethoscope size={16} aria-hidden="true" />
              </div>
              <div className={styles.statBody}>
                <span className={styles.statLabel}>Care team</span>
                <span className={styles.statValue}>Doctors</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
