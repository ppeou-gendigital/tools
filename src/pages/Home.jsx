import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CircleUserRound,
  Clock,
  FilePenLine,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  Mail,
  Plus,
  Users,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { cx } from '@/lib/cx'
import { createWorkspace, listWorkspaces } from '@/lib/invitesApi'
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
  const qc = useQueryClient()
  const [layout, setLayout] = useState(readHomeLayout)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery({
    queryKey: ['toolname', 'workspaces'],
    queryFn: listWorkspaces,
  })

  function changeLayout(next) {
    const value = next === 'tiles' ? 'tiles' : 'list'
    setLayout(value)
    try {
      localStorage.setItem(HOME_LAYOUT_KEY, value)
    } catch {
      // ignore
    }
  }

  async function onCreateWorkspace(e) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title || creating) return
    setCreating(true)
    setCreateError('')
    try {
      const ws = await createWorkspace(title)
      setNewTitle('')
      await qc.invalidateQueries({ queryKey: ['toolname', 'workspaces'] })
      nav.goWorkspace(ws.id)
    } catch (err) {
      setCreateError(
        err?.message ??
          'Could not create workspace. Run supabase/template_invites.sql first.',
      )
    } finally {
      setCreating(false)
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
          <h2 className={styles.sectionTitle}>Workspaces</h2>
          <p className={styles.sectionHint}>
            Demo invite flow: create a workspace, share a join link, guests
            peek while logged out then sign in to accept.
          </p>
          <form className={styles.createRow} onSubmit={onCreateWorkspace}>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Workspace title"
              aria-label="Workspace title"
            />
            <Button type="submit" disabled={creating || !newTitle.trim()}>
              <Plus size={14} aria-hidden="true" />
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </form>
          {createError && (
            <p className={styles.createError} role="alert">
              {createError}
            </p>
          )}
          {workspacesLoading && (
            <p className={styles.sectionHint}>Loading workspaces…</p>
          )}
          {!workspacesLoading && workspaces.length === 0 && (
            <p className={styles.sectionHint}>No workspaces yet.</p>
          )}
          {workspaces.length > 0 && (
            <ul className={itemsClass}>
              {workspaces.map((ws) => (
                <li
                  key={ws.id}
                  className={isTiles ? styles.tileItem : undefined}
                >
                  <button
                    type="button"
                    className={cx(styles.card, isTiles && styles.tileCard)}
                    onClick={() => nav.goWorkspace(ws.id)}
                  >
                    <Users size={16} className={styles.cardIcon} aria-hidden="true" />
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{ws.title}</span>
                      <span className={styles.cardMeta}>
                        Updated {formatDate(ws.updatedAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

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
