import { useEffect, useRef } from 'react'
import {
  Archive,
  ListChecks,
  ListMusic,
  MapPin,
  UserRound,
  Users,
  CircleDollarSign,
} from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { APP_VERSION } from '@/env'
import { Divider } from '@/molecules/Divider'
import { Logo } from '@/molecules/Logo'
import { MenuRow } from '@/molecules/MenuRow'
import { AboutRow } from '@/patterns/AboutRow'
import { AccountRow } from '@/patterns/AccountRow'
import { AppearanceRow } from '@/patterns/AppearanceRow'
import { AppNavItems } from '@/patterns/AppNavItems'
import { DevBadgeItem } from '@/patterns/DevBadgeItem'
import styles from './MenuPanel.module.scss'

const TOOL_NAME = 'Viaggio'

const JOURNEY_ROUTES = new Set([
  'journey',
  'entry-edit',
  'expense-edit',
  'members',
  'spending',
  'playlist',
  'todos',
  'map',
  'journey-settings',
])

export function MenuPanel({ corner, onClose }) {
  const { user } = useAuth()
  const nav = useNavigation()
  const panelRef = useRef(null)
  const signedIn = !!user
  const journeyId = nav.params?.journeyId
  const inJourney = signedIn && journeyId && JOURNEY_ROUTES.has(nav.route)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusables = panel.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )
    const first = focusables[0]
    if (first instanceof HTMLElement) first.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return
      const list = [...focusables]
      const firstEl = list[0]
      const lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`${TOOL_NAME} menu`}
      className={styles.panel}
      data-corner={corner}
    >
      <div className={styles.brand}>
        <Logo size={28} alt={TOOL_NAME} />
        <span className={styles.brandName}>{TOOL_NAME}</span>
      </div>
      <Divider />
      <AppearanceRow onClose={onClose} />
      {signedIn && <Divider />}
      {signedIn && <AccountRow onClose={onClose} />}
      {inJourney && (
        <>
          <Divider />
          <p className={styles.sectionLabel}>This journey</p>
          <MenuRow
            icon={Users}
            label="Travelers"
            onClose={onClose}
            onClick={() => nav.goMembers(journeyId)}
          />
          <MenuRow
            icon={CircleDollarSign}
            label="Spending"
            onClose={onClose}
            onClick={() => nav.goSpending(journeyId)}
          />
          <MenuRow
            icon={ListMusic}
            label="Playlist"
            onClose={onClose}
            onClick={() => nav.goPlaylist(journeyId)}
          />
          <MenuRow
            icon={ListChecks}
            label="To-dos"
            onClose={onClose}
            onClick={() => nav.goTodos(journeyId)}
          />
          <MenuRow
            icon={MapPin}
            label="Map"
            onClose={onClose}
            onClick={() => nav.goMap(journeyId)}
          />
        </>
      )}
      {signedIn && (
        <>
          <Divider />
          <p className={styles.sectionLabel}>App</p>
          <AppNavItems onClose={onClose} />
          <MenuRow
            icon={UserRound}
            label="People"
            onClose={onClose}
            onClick={nav.goPeople}
          />
          <MenuRow
            icon={Archive}
            label="Archives"
            onClose={onClose}
            onClick={nav.goArchives}
          />
        </>
      )}
      <DevBadgeItem />
      <AboutRow name={TOOL_NAME} version={APP_VERSION} />
    </div>
  )
}
