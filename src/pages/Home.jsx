import { useMemo, useState } from 'react'
import {
  CircleUserRound,
  Clock,
  FilePenLine,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  Mail,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { cx } from '@/lib/cx'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Home.module.scss'

const HOME_LAYOUT_KEY = 'toolname:homeLayout'

function readHomeLayout() {
  try {
    const v = localStorage.getItem(HOME_LAYOUT_KEY)
    return v === 'tiles' ? 'tiles' : 'list'
  } catch {
    return 'list'
  }
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function Home() {
  const { user } = useAuth()
  const nav = useNavigation()
  const [layout, setLayout] = useState(readHomeLayout)

  function changeLayout(next) {
    const value = next === 'tiles' ? 'tiles' : 'list'
    setLayout(value)
    try {
      localStorage.setItem(HOME_LAYOUT_KEY, value)
    } catch {
      // ignore
    }
  }

  const samples = useMemo(
    () => [
      {
        id: 'deck',
        title: 'Deck demo',
        meta: 'Responsive slide grid',
        icon: LayoutTemplate,
        go: nav.goDeckDemo,
      },
      {
        id: 'rich',
        title: 'Rich text demo',
        meta: 'TipTap notes sample',
        icon: FilePenLine,
        go: nav.goRichTextDemo,
      },
      {
        id: 'profile',
        title: 'Profile',
        meta: user?.email || 'Account details',
        icon: CircleUserRound,
        go: nav.goProfile,
      },
    ],
    [nav, user?.email],
  )

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
        title="Welcome back"
        subtitle="You're signed in."
        actions={layoutToggle}
        shortcuts={
          <PageShortcuts current="home" className={styles.iconBtn} />
        }
      />

      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Mail size={16} aria-hidden="true" />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Email</span>
              <span className={styles.statValue} title={user?.email}>
                {user?.email ?? '—'}
              </span>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Clock size={16} aria-hidden="true" />
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Signed in at</span>
              <span className={styles.statValue}>
                {formatDate(user?.last_sign_in_at)}
              </span>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Get started</h2>
          <ul className={itemsClass}>
            {samples.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.id}
                  className={isTiles ? styles.tileItem : undefined}
                >
                  <button
                    type="button"
                    className={cx(styles.card, isTiles && styles.tileCard)}
                    onClick={item.go}
                  >
                    <Icon size={16} className={styles.cardIcon} aria-hidden="true" />
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{item.title}</span>
                      <span className={styles.cardMeta}>{item.meta}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <Button variant="outline" onClick={nav.goProfile} fullWidth>
          <CircleUserRound size={14} aria-hidden="true" />
          Edit profile
        </Button>
      </div>
    </div>
  )
}
