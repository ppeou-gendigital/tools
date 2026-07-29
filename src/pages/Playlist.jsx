import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ExternalLink,
  GripVertical,
  Link2,
  ListChecks,
  MapPin,
  Music2,
  Paperclip,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Users,
  Video,
  CircleDollarSign,
} from 'lucide-react'
import { AiPlannerButton } from '@/molecules/AiPlannerButton'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import {
  PlatformGlyph,
  hasPlatformGlyph,
} from '@/molecules/PlatformGlyph'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { formatRelativeDay, labelForUserId } from '@/lib/format'
import { parseMediaLink } from '@/lib/mediaEmbed'
import {
  addPlaylistItem,
  deletePlaylistItem,
  detectPlaylistPlatform,
  fetchDisplayNames,
  getJourney,
  listPlaylist,
  myMembership,
  reorderPlaylistItems,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { usePlaylistPlayback } from '@/providers/PlaylistPlaybackProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  soundcloud: 'SoundCloud',
  vimeo: 'Vimeo',
  tiktok: 'TikTok',
  link: 'Link',
}

const PLATFORM_ICONS = {
  youtube: Video,
  spotify: Music2,
  apple_music: Music2,
  soundcloud: Music2,
  vimeo: Video,
  tiktok: Video,
  link: Link2,
}

const DRAG_THRESHOLD_PX = 8

function urlHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function playlistMeta(item, { currentUserId, displayNames, displayLocale }) {
  const host = urlHost(item.url)
  const addedBy = item.createdBy
    ? labelForUserId(item.createdBy, currentUserId, displayNames)
    : null
  const when = formatRelativeDay(item.createdAt, displayLocale)
  const who =
    addedBy && addedBy !== 'You' ? `Added by ${addedBy}` : null
  return [host && item.title?.trim() ? host : null, who, when]
    .filter(Boolean)
    .join(' · ')
}

function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function indexFromPoint(listEl, clientY) {
  if (!listEl) return -1
  const rows = [...listEl.querySelectorAll('[data-playlist-id]')]
  if (rows.length === 0) return -1
  for (let i = 0; i < rows.length; i += 1) {
    const rect = rows[i].getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    if (clientY < mid) return i
  }
  return rows.length - 1
}

export function Playlist() {
  const {
    params,
    goBack,
    previousRouteLabel,
    goMembers,
    goSpending,
    goAttachments,
    goTodos,
    goMap,
    goJourneySettings,
  } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const { displayLocale } = useDisplayPrefs()
  const qc = useQueryClient()
  const listRef = useRef(null)
  const dragRef = useRef(null)
  const orderedRef = useRef([])
  const [addOpen, setAddOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [reorderError, setReorderError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [ordered, setOrdered] = useState([])
  const [draggingId, setDraggingId] = useState(null)
  const [overIndex, setOverIndex] = useState(-1)
  const {
    trackId: playingTrackId,
    journeyId: playingJourneyId,
    playAt,
    registerPlayerSlot,
  } = usePlaylistPlayback()

  useEffect(() => {
    orderedRef.current = ordered
  }, [ordered])

  // Offer a layout slot for the shell-mounted player while this page is open.
  useEffect(() => {
    return () => registerPlayerSlot(null)
  }, [registerPlayerSlot])

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const {
    data: membership,
    isLoading: membershipLoading,
  } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const {
    data: items = [],
    isLoading,
    isFetching,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ['viaggio', 'playlist', journeyId],
    queryFn: () => listPlaylist(journeyId),
    enabled: !!journeyId,
  })

  const creatorIds = useMemo(
    () => [...new Set(ordered.map((i) => i.createdBy).filter(Boolean))],
    [ordered],
  )

  const { data: displayNames = new Map() } = useQuery({
    queryKey: ['viaggio', 'display-names', creatorIds.join(',')],
    queryFn: () => fetchDisplayNames(creatorIds),
    enabled: creatorIds.length > 0,
  })

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const isViewer = !!membership && !canEdit
  const canReorder = canEdit && ordered.length > 1
  const detected = detectPlaylistPlatform(url)
  const knownPlatform =
    detected && detected !== 'link' ? detected : null

  const addMut = useMutation({
    mutationFn: () =>
      addPlaylistItem(
        journeyId,
        {
          url: url.trim(),
          title:
            title.trim() ||
            (knownPlatform ? PLATFORM_LABELS[knownPlatform] : ''),
        },
        user.id,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'playlist', journeyId] })
      setUrl('')
      setTitle('')
      setError('')
      setAddOpen(false)
    },
    onError: (err) => setError(err.message),
  })

  const reorderMut = useMutation({
    mutationFn: (orderedIds) =>
      reorderPlaylistItems(journeyId, orderedIds),
    onError: (err, _ids, context) => {
      if (context?.previous) {
        setOrdered(context.previous)
        qc.setQueryData(
          ['viaggio', 'playlist', journeyId],
          context.previous,
        )
      }
      setReorderError(err.message || 'Could not save new order.')
    },
    onSuccess: (_data, orderedIds) => {
      qc.setQueryData(['viaggio', 'playlist', journeyId], (old) => {
        const source = old?.length ? old : orderedRef.current
        const byId = new Map(source.map((i) => [i.id, i]))
        return orderedIds
          .map((id, sortOrder) => {
            const item = byId.get(id)
            return item ? { ...item, sortOrder } : null
          })
          .filter(Boolean)
      })
      setReorderError('')
    },
  })

  // Sync server list into local order unless dragging / saving order.
  useEffect(() => {
    if (dragRef.current || reorderMut.isPending) return
    setOrdered(items)
  }, [items, reorderMut.isPending])

  // Default: select first playable track (paused) so the play bar is visible.
  useEffect(() => {
    if (!journeyId || ordered.length === 0) return
    if (playingJourneyId === journeyId && playingTrackId) return
    const first =
      ordered.find((item) => parseMediaLink(item.url).playable) || ordered[0]
    if (!first?.id) return
    playAt({ journeyId, trackId: first.id, autoplay: false })
  }, [
    journeyId,
    ordered,
    playingJourneyId,
    playingTrackId,
    playAt,
  ])

  function playTrack(item) {
    if (!journeyId || !item?.id) return
    playAt({ journeyId, trackId: item.id })
  }

  function openAdd() {
    setError('')
    setAddOpen(true)
  }

  function closeAdd() {
    if (addMut.isPending) return
    setAddOpen(false)
    setError('')
  }

  function submitAdd(e) {
    e?.preventDefault?.()
    if (!url.trim() || addMut.isPending) return
    setError('')
    addMut.mutate()
  }

  function onGripPointerDown(e, index) {
    if (!canReorder || (e.button != null && e.button !== 0)) return
    e.preventDefault()
    e.stopPropagation()
    const grip = e.currentTarget
    grip.setPointerCapture(e.pointerId)
    const snapshot = orderedRef.current
    dragRef.current = {
      pointerId: e.pointerId,
      fromIndex: index,
      overIndex: index,
      startY: e.clientY,
      active: false,
      snapshot,
      dragId: snapshot[index]?.id ?? null,
    }
    setReorderError('')
  }

  function onGripPointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    e.preventDefault()
    const dy = Math.abs(e.clientY - drag.startY)
    if (!drag.active && dy < DRAG_THRESHOLD_PX) return
    if (!drag.active) {
      drag.active = true
      setDraggingId(drag.dragId)
    }
    const nextOver = indexFromPoint(listRef.current, e.clientY)
    if (nextOver < 0 || nextOver === drag.overIndex) return
    drag.overIndex = nextOver
    setOverIndex(nextOver)
    setOrdered(moveItem(drag.snapshot, drag.fromIndex, nextOver))
  }

  function endDrag(e) {
    const drag = dragRef.current
    if (!drag || (e && drag.pointerId !== e.pointerId)) return
    const wasActive = drag.active
    const previous = drag.snapshot
    const current = orderedRef.current
    dragRef.current = null
    setDraggingId(null)
    setOverIndex(-1)
    if (!wasActive) return

    const orderedIds = current.map((i) => i.id)
    const prevIds = previous.map((i) => i.id)
    if (orderedIds.every((id, i) => id === prevIds[i])) return

    qc.setQueryData(['viaggio', 'playlist', journeyId], current)
    reorderMut.mutate(orderedIds, {
      onMutate: () => ({ previous }),
    })
  }

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing journey.</p>
          <Button variant="outline" onClick={goBack} fullWidth>
            Back
          </Button>
        </div>
      </div>
    )
  }

  const countLabel =
    !isLoading && ordered.length > 0
      ? `${ordered.length} link${ordered.length === 1 ? '' : 's'}`
      : null

  return (
    <div className={styles.page}>
      <PageHeader
        title="Playlist"
        subtitle={[journey?.title, countLabel].filter(Boolean).join(' · ')}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          <div className={styles.toolbar}>
            <Button
              variant="ghost"
              size="sm"
              className={styles.iconBtn}
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh playlist"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
                className={isFetching ? styles.spin : undefined}
              />
            </Button>
            {canEdit && (
              <AiPlannerButton
                journeyId={journeyId}
                className={styles.iconBtn}
              />
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={openAdd}
                aria-label="Add link"
                title="Add link"
              >
                <Plus size={14} aria-hidden="true" />
              </Button>
            )}
          </div>
        }
        shortcuts={
          <PageShortcuts
            current="playlist"
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
        {isLoading && <LoadingState>Loading playlist…</LoadingState>}
        {loadError && (
          <div className={styles.empty}>
            <p className={styles.error} role="alert">
              Could not load playlist. ({loadError.message})
            </p>
            <Button variant="outline" onClick={() => refetch()} fullWidth>
              Retry
            </Button>
          </div>
        )}

        {reorderError && (
          <p className={styles.error} role="alert">
            {reorderError}
          </p>
        )}

        {!isLoading && !loadError && ordered.length === 0 && (
          <div className={styles.empty}>
            <p>
              Share YouTube, Spotify, Vimeo, SoundCloud, or other links for the
              group.
            </p>
            {canEdit && (
              <Button onClick={openAdd}>
                <Plus size={14} aria-hidden="true" />
                Add link
              </Button>
            )}
            {isViewer && (
              <p className={styles.hint}>Ask an editor to add links.</p>
            )}
            {!canEdit && !isViewer && membershipLoading && (
              <p className={styles.hint}>Checking access…</p>
            )}
          </div>
        )}

        {error && !addOpen && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!isLoading && !loadError && ordered.length > 0 && (
          <div className={styles.playlistStage}>
            <div
              ref={registerPlayerSlot}
              className={styles.playlistPlayerSlot}
            >
              {!(
                playingJourneyId === journeyId && playingTrackId
              ) && (
                <p className={styles.playlistPlayerPlaceholder}>
                  Pick a track to play
                </p>
              )}
            </div>
            <ul
              ref={listRef}
              className={styles.playlistList}
              aria-label="Playlist tracks"
              aria-busy={reorderMut.isPending || undefined}
            >
              {ordered.map((item, index) => {
                const platformKey = item.platform || 'link'
                const platform =
                  PLATFORM_LABELS[platformKey] || platformKey
                const PlatformIcon = PLATFORM_ICONS[platformKey] || Link2
                const brandGlyph = hasPlatformGlyph(platformKey)
                const host = urlHost(item.url)
                const label = item.title?.trim() || host || item.url
                const meta = playlistMeta(item, {
                  currentUserId: user?.id,
                  displayNames,
                  displayLocale,
                })
                const isDragging = draggingId === item.id
                const isPlaying =
                  playingJourneyId === journeyId &&
                  playingTrackId === item.id
                const playable = parseMediaLink(item.url).playable
                return (
                  <li
                    key={item.id}
                    data-playlist-id={item.id}
                    className={cx(
                      styles.playlistRow,
                      canReorder && styles.playlistRowEditable,
                      isDragging && styles.playlistRowDragging,
                      isPlaying && styles.playlistRowPlaying,
                      overIndex === index &&
                        draggingId &&
                        !isDragging &&
                        styles.playlistRowDropTarget,
                    )}
                  >
                    {canReorder && (
                      <button
                        type="button"
                        className={styles.playlistGrip}
                        aria-label={`Drag to reorder ${label}`}
                        title="Drag to reorder"
                        onPointerDown={(e) => onGripPointerDown(e, index)}
                        onPointerMove={onGripPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      >
                        <GripVertical size={16} aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.playlistHit}
                      tabIndex={isDragging ? -1 : 0}
                      aria-current={isPlaying ? 'true' : undefined}
                      aria-label={
                        playable
                          ? `Play ${label}`
                          : `Select ${label}`
                      }
                      onClick={() => {
                        if (dragRef.current?.active) return
                        playTrack(item)
                      }}
                    >
                      <span
                        className={cx(
                          styles.platformIcon,
                          brandGlyph && styles.platformIconBrand,
                        )}
                        title={platform}
                        aria-hidden="true"
                      >
                        {brandGlyph ? (
                          <PlatformGlyph platform={platformKey} size={16} />
                        ) : (
                          <PlatformIcon size={16} aria-hidden="true" />
                        )}
                      </span>
                      <span className={styles.rowBody}>
                        <span className={styles.playlistTitle}>
                          <span className={styles.playlistTitleText}>
                            {label}
                          </span>
                          {isPlaying ? (
                            <span className={styles.playlistNowBadge}>
                              Now
                            </span>
                          ) : null}
                        </span>
                        {meta ? (
                          <span className={styles.rowMeta}>{meta}</span>
                        ) : null}
                      </span>
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.playlistOpen}
                      aria-label={`Open ${label} in browser`}
                      title="Open in browser"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cx(
                          styles.iconBtnDanger,
                          styles.playlistDelete,
                        )}
                        aria-label={`Remove ${label}`}
                        onClick={() => setConfirmDelete(item)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <Modal open={addOpen} onDismiss={closeAdd} title="Add link">
        <form className={styles.sheet} onSubmit={submitAdd}>
          <div className={styles.field}>
            <Label htmlFor="playlist-url">URL</Label>
            <Input
              id="playlist-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              placeholder="YouTube, Spotify, Vimeo, SoundCloud…"
              inputMode="url"
              autoComplete="url"
              required
            />
            {knownPlatform && (
              <p className={styles.hint}>
                {PLATFORM_LABELS[knownPlatform]} detected
              </p>
            )}
          </div>
          <div className={styles.field}>
            <Label htmlFor="playlist-title">Title (optional)</Label>
            <Input
              id="playlist-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                knownPlatform
                  ? `${PLATFORM_LABELS[knownPlatform]} link`
                  : 'Label for the group'
              }
            />
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={!url.trim() || addMut.isPending}
            fullWidth
          >
            <Plus size={14} aria-hidden="true" />
            {addMut.isPending ? 'Adding…' : 'Add link'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onDismiss={() => !deleting && setConfirmDelete(null)}
        title="Remove link?"
        message={
          confirmDelete
            ? `Remove “${confirmDelete.title || urlHost(confirmDelete.url) || confirmDelete.url}” from the playlist?`
            : undefined
        }
        confirmLabel="Remove"
        busyLabel="Removing…"
        confirming={deleting}
        onConfirm={async () => {
          if (!confirmDelete) return
          setDeleting(true)
          try {
            await deletePlaylistItem(confirmDelete.id)
            qc.invalidateQueries({
              queryKey: ['viaggio', 'playlist', journeyId],
            })
            setConfirmDelete(null)
          } finally {
            setDeleting(false)
          }
        }}
      />
    </div>
  )
}
