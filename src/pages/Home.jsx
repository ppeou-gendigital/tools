import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Book,
  CopyPlus,
  FileText,
  GripVertical,
  LayoutGrid,
  LayoutList,
  Pencil,
  Pin,
  Plus,
  Search,
  StickyNotePlus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { LockboxSessionToggle } from '@/molecules/LockboxSessionToggle'
import { DeleteNotebookModal } from '@/patterns/DeleteNotebookModal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useLockbox } from '@/providers/LockboxProvider'
import { usePrompt } from '@/providers/PromptProvider'
import { useRevealedNotePreviews } from '@/hooks/useRevealedNotePreviews'
import {
  effectiveLockboxId,
  notesInNotebook,
} from '@/lib/workspaceModel'
import { bodyToPreviewText } from '@/lib/noteBody'
import { asyncStorage } from '@/lib/storage'
import { cx } from '@/lib/cx'
import styles from './Home.module.scss'

const VIEW_OPTIONS = [
  { id: 'book', label: 'Book' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'custom', label: 'Custom' },
  { id: 'tags', label: 'Tags' },
]

const NOTEBOOK_LAYOUT_KEY = 'notas:notebooksLayout'
const VIEWING_NOTES_KEY = 'notas:viewingNotebookNotes'

function readNotebookLayout() {
  try {
    const v = localStorage.getItem(NOTEBOOK_LAYOUT_KEY)
    return v === 'tiles' ? 'tiles' : 'list'
  } catch {
    return 'list'
  }
}

function readViewingNotesSync() {
  try {
    return localStorage.getItem(VIEWING_NOTES_KEY) === '1'
  } catch {
    return false
  }
}

function persistViewingNotes(on) {
  const value = on ? '1' : '0'
  try {
    localStorage.setItem(VIEWING_NOTES_KEY, value)
  } catch {
    /* ignore */
  }
  asyncStorage.setItem(VIEWING_NOTES_KEY, value)
}

function formatUpdated(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function previewBody(body, locked, decrypting) {
  if (locked) return 'Protected — unlock to read'
  if (decrypting) return 'Decrypting…'
  const text = bodyToPreviewText(body)
  if (!text) return 'No content'
  return text
}

function displayTitle(note, locked, preview) {
  if (locked) return 'Locked note'
  if (preview?.title) return preview.title
  const stored = typeof note.title === 'string' ? note.title.trim() : ''
  if (stored && stored !== 'Locked note') return stored
  if (note.ciphertext) return 'Decrypting…'
  return 'Untitled'
}

function displayBody(note, locked, preview) {
  if (locked) return ''
  if (preview) return preview.body ?? ''
  if (note.ciphertext) return ''
  return note.body ?? ''
}

function nameMatches(name, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return String(name ?? '')
    .toLowerCase()
    .includes(q)
}

export function Home() {
  const {
    sections,
    ready,
    notebooks,
    activeNotebook,
    activeNotebookId,
    setActiveNotebookId,
    setActiveNoteId,
    currentView,
    currentTimelineField,
    setNotebookViewPrefs,
    setTimelineFieldOverride,
    tagFilterId,
    setTagFilterId,
    tags,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    reorderNotes,
    workspace,
    pinnedNotebookIds,
    setNotebookPinned,
  } = useNotes()
  const {
    noteIsLocked,
    requestUnlock,
    isUnlocked,
    unlockedIds,
    revealNoteContent,
  } = useLockbox()
  const { navigate } = useNavigation()
  const { prompt } = usePrompt()
  const [creatingNotebook, setCreatingNotebook] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [wantViewingNotes, setWantViewingNotes] = useState(readViewingNotesSync)
  const [notebookQuery, setNotebookQuery] = useState('')
  const [nameSort, setNameSort] = useState('asc')
  const [notebookLayout, setNotebookLayout] = useState(readNotebookLayout)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionError, setActionError] = useState(null)

  const viewingNotes =
    wantViewingNotes &&
    Boolean(activeNotebookId) &&
    notebooks.some((nb) => nb.id === activeNotebookId)

  function setViewingNotes(next) {
    const on = Boolean(next)
    setWantViewingNotes(on)
    persistViewingNotes(on)
  }

  // Extension: chrome.storage may have the flag when sync localStorage does not.
  useEffect(() => {
    if (readViewingNotesSync()) return
    let cancelled = false
    ;(async () => {
      const stored = await asyncStorage.getItem(VIEWING_NOTES_KEY)
      if (cancelled || stored !== '1') return
      setWantViewingNotes(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function changeNotebookLayout(next) {
    const layout = next === 'tiles' ? 'tiles' : 'list'
    setNotebookLayout(layout)
    try {
      localStorage.setItem(NOTEBOOK_LAYOUT_KEY, layout)
    } catch {
      /* ignore */
    }
  }

  const visibleNotes = useMemo(
    () => sections.flatMap((s) => s.notes),
    [sections],
  )
  const revealed = useRevealedNotePreviews(workspace, visibleNotes, {
    isUnlocked,
    unlockedIds,
    revealNoteContent,
  })

  const notebookLockboxId = activeNotebook?.lockboxId ?? null

  const noteCount = useMemo(
    () => sections.reduce((n, s) => n + s.notes.length, 0),
    [sections],
  )

  const noteCountByNotebook = useMemo(() => {
    const map = new Map()
    for (const nb of notebooks) {
      map.set(nb.id, notesInNotebook(workspace, nb.id).length)
    }
    return map
  }, [notebooks, workspace])

  const pinnedSet = useMemo(
    () => new Set(pinnedNotebookIds ?? []),
    [pinnedNotebookIds],
  )

  const pinnedNotebooks = useMemo(() => {
    return (pinnedNotebookIds ?? [])
      .map((id) => notebooks.find((nb) => nb.id === id))
      .filter(Boolean)
      .filter((nb) => nameMatches(nb.name, notebookQuery))
  }, [pinnedNotebookIds, notebooks, notebookQuery])

  const libraryNotebooks = useMemo(() => {
    const dir = nameSort === 'desc' ? -1 : 1
    return [...notebooks]
      .filter((nb) => !pinnedSet.has(nb.id))
      .filter((nb) => nameMatches(nb.name, notebookQuery))
      .sort(
        (a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) *
          dir,
      )
  }, [notebooks, pinnedSet, notebookQuery, nameSort])

  function openNew() {
    setActiveNoteId(null)
    navigate('note-edit')
  }

  async function openNote(note) {
    const lbId = effectiveLockboxId(workspace, note)
    if (lbId && note.ciphertext && !isUnlocked(lbId)) {
      try {
        await requestUnlock(lbId)
      } catch {
        return
      }
    }
    setActiveNoteId(note.id)
    navigate('note-edit')
  }

  async function handleCreateNotebook() {
    if (creatingNotebook) return
    setCreatingNotebook(true)
    try {
      const name = await prompt({
        title: 'New notebook',
        label: 'Notebook name',
        defaultValue: 'Notebook',
        confirmLabel: 'Create',
      })
      if (name == null) return
      await createNotebook({ name })
      setViewingNotes(false)
    } finally {
      setCreatingNotebook(false)
    }
  }

  async function handleRenameNotebook(notebook) {
    if (!notebook) return
    setActionError(null)
    const name = await prompt({
      title: `Rename “${notebook.name}”`,
      label: 'Notebook name',
      defaultValue: notebook.name,
      confirmLabel: 'Save',
    })
    if (name == null) return
    try {
      await updateNotebook(notebook.id, { name })
    } catch (err) {
      setActionError(err?.message ?? String(err))
    }
  }

  function handleRequestDeleteNotebook(notebook) {
    if (!notebook) return
    setActionError(null)
    if (notebooks.length <= 1) {
      setActionError('Cannot delete the last notebook.')
      return
    }
    setDeleteTarget(notebook)
  }

  async function handleConfirmDeleteNotebook(options) {
    if (!deleteTarget) return
    await deleteNotebook(deleteTarget.id, options)
    if (activeNotebookId === deleteTarget.id) {
      setViewingNotes(false)
    }
    setDeleteTarget(null)
  }

  async function openNotebook(notebookId) {
    await setActiveNotebookId(notebookId)
    setViewingNotes(true)
  }

  async function togglePin(notebookId, currentlyPinned) {
    await setNotebookPinned(notebookId, !currentlyPinned)
  }

  const deleteModal = (
    <DeleteNotebookModal
      open={Boolean(deleteTarget)}
      notebook={deleteTarget}
      workspace={workspace}
      notebooks={notebooks}
      onDismiss={() => setDeleteTarget(null)}
      onConfirm={handleConfirmDeleteNotebook}
    />
  )

  async function onDropReorder(targetId) {
    if (!dragId || dragId === targetId || !activeNotebookId) {
      setDragId(null)
      return
    }
    if (currentView !== 'book' && currentView !== 'custom') {
      setDragId(null)
      return
    }
    const flat = sections.flatMap((s) => s.notes)
    const ids = flat.map((n) => n.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    if (from < 0 || to < 0) {
      setDragId(null)
      return
    }
    const next = [...ids]
    next.splice(from, 1)
    next.splice(to, 0, dragId)
    await reorderNotes(
      activeNotebookId,
      next,
      currentView === 'book' ? 'book' : 'custom',
    )
    setDragId(null)
  }

  if (!viewingNotes) {
    return (
      <div className={styles.page}>
        {deleteModal}
        <PageHeader
          title="Notebooks"
          subtitle={
            ready
              ? `${notebooks.length} notebook${notebooks.length === 1 ? '' : 's'}`
              : 'Loading…'
          }
          actions={
            <div className={styles.headerActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateNotebook}
                disabled={creatingNotebook}
                aria-label="New notebook"
                title="New notebook"
              >
                <CopyPlus size={16} aria-hidden="true" />
              </Button>
            </div>
          }
          shortcuts={
            <PageShortcuts current="home" className={styles.iconBtn} />
          }
        />

        <div className={styles.body}>
          {actionError && <p className={styles.actionError}>{actionError}</p>}
          <div className={styles.notebookToolbar}>
            <label className={styles.searchField}>
              <Search size={14} aria-hidden="true" className={styles.searchIcon} />
              <Input
                type="search"
                value={notebookQuery}
                onChange={(e) => setNotebookQuery(e.target.value)}
                placeholder="Search notebooks"
                aria-label="Search notebooks"
                className={styles.searchInput}
              />
            </label>
            <div className={styles.notebookToolbarControls}>
              <div className={styles.layoutToggle} role="group" aria-label="Notebook layout">
                <button
                  type="button"
                  className={cx(
                    styles.layoutBtn,
                    notebookLayout === 'list' && styles.layoutBtnActive,
                  )}
                  onClick={() => changeNotebookLayout('list')}
                  aria-pressed={notebookLayout === 'list'}
                  aria-label="List layout"
                  title="List"
                >
                  <LayoutList size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={cx(
                    styles.layoutBtn,
                    notebookLayout === 'tiles' && styles.layoutBtnActive,
                  )}
                  onClick={() => changeNotebookLayout('tiles')}
                  aria-pressed={notebookLayout === 'tiles'}
                  aria-label="Tiles layout"
                  title="Tiles"
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                </button>
              </div>
              <label className={styles.viewMeta}>
                <span className={styles.viewLabel}>Sort</span>
                <select
                  className={styles.viewSelect}
                  value={nameSort}
                  onChange={(e) => setNameSort(e.target.value)}
                  aria-label="Sort notebooks by name"
                >
                  <option value="asc">Name A–Z</option>
                  <option value="desc">Name Z–A</option>
                </select>
              </label>
            </div>
          </div>

          {!ready ? (
            <p className={styles.empty}>Loading notebooks…</p>
          ) : notebooks.length === 0 ? (
            <div className={styles.emptyState}>
              <Book
                size={32}
                aria-hidden="true"
                className={styles.emptyIcon}
              />
              <div className={styles.emptyCopy}>
                <p className={styles.emptyTitle}>No notebooks yet</p>
                <p className={styles.empty}>Create one to start writing.</p>
              </div>
              <Button onClick={handleCreateNotebook} disabled={creatingNotebook}>
                <Plus size={14} aria-hidden="true" />
                New notebook
              </Button>
            </div>
          ) : pinnedNotebooks.length === 0 && libraryNotebooks.length === 0 ? (
            <p className={styles.empty}>No notebooks match “{notebookQuery.trim()}”.</p>
          ) : (
            <div className={styles.sections}>
              {pinnedNotebooks.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Pinned</h2>
                  <ul
                    className={
                      notebookLayout === 'tiles' ? styles.tileGrid : styles.list
                    }
                  >
                    {pinnedNotebooks.map((nb) => (
                      <NotebookRow
                        key={nb.id}
                        layout={notebookLayout}
                        notebook={nb}
                        noteCount={noteCountByNotebook.get(nb.id) ?? 0}
                        pinned
                        canDelete={notebooks.length > 1}
                        onOpen={() => openNotebook(nb.id)}
                        onTogglePin={() => togglePin(nb.id, true)}
                        onRename={() => handleRenameNotebook(nb)}
                        onDelete={() => handleRequestDeleteNotebook(nb)}
                      />
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {pinnedNotebooks.length > 0 ? 'All notebooks' : 'Notebooks'}
                </h2>
                {libraryNotebooks.length === 0 ? (
                  <p className={styles.empty}>
                    {notebookQuery.trim()
                      ? 'No other notebooks match this search.'
                      : 'All notebooks are pinned.'}
                  </p>
                ) : (
                  <ul
                    className={
                      notebookLayout === 'tiles' ? styles.tileGrid : styles.list
                    }
                  >
                    {libraryNotebooks.map((nb) => (
                      <NotebookRow
                        key={nb.id}
                        layout={notebookLayout}
                        notebook={nb}
                        noteCount={noteCountByNotebook.get(nb.id) ?? 0}
                        pinned={false}
                        canDelete={notebooks.length > 1}
                        onOpen={() => openNotebook(nb.id)}
                        onTogglePin={() => togglePin(nb.id, false)}
                        onRename={() => handleRenameNotebook(nb)}
                        onDelete={() => handleRequestDeleteNotebook(nb)}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {deleteModal}
      <PageHeader
        title={activeNotebook?.name ?? 'Notes'}
        subtitle={
          ready
            ? `${noteCount} note${noteCount === 1 ? '' : 's'}`
            : 'Loading…'
        }
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingNotes(false)}
            className={styles.back}
            aria-label="Back to notebooks"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Notebooks
          </Button>
        }
        actions={
          <div className={styles.headerActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRenameNotebook(activeNotebook)}
              aria-label="Rename notebook"
              title="Rename notebook"
            >
              <Pencil size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRequestDeleteNotebook(activeNotebook)}
              disabled={notebooks.length <= 1}
              aria-label="Delete notebook"
              title="Delete notebook"
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openNew}
              aria-label="New note"
              title="New note"
            >
              <StickyNotePlus size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateNotebook}
              disabled={creatingNotebook}
              aria-label="New notebook"
              title="New notebook"
            >
              <CopyPlus size={16} aria-hidden="true" />
            </Button>
          </div>
        }
        shortcuts={
          <PageShortcuts current="home" className={styles.iconBtn} />
        }
      />

      <div className={styles.body}>
        {actionError && <p className={styles.actionError}>{actionError}</p>}
        <div className={styles.toolbar}>
          <div className={styles.metaRow}>
            <div className={styles.notebookMeta}>
              {notebookLockboxId && (
                <LockboxSessionToggle
                  lockboxId={notebookLockboxId}
                  label="notebook"
                  className={styles.sessionToggle}
                />
              )}
            </div>

            <div className={styles.metaControls}>
              <label className={styles.viewMeta}>
                <span className={styles.viewLabel}>View</span>
                <select
                  className={styles.viewSelect}
                  value={currentView}
                  onChange={(e) => setNotebookViewPrefs(e.target.value)}
                  aria-label="View mode"
                >
                  {VIEW_OPTIONS.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              {currentView === 'timeline' && (
                <label className={styles.viewMeta}>
                  <span className={styles.viewLabel}>Sort</span>
                  <select
                    className={styles.viewSelect}
                    value={currentTimelineField}
                    onChange={(e) => {
                      setTimelineFieldOverride(e.target.value)
                      setNotebookViewPrefs('timeline', e.target.value)
                    }}
                    aria-label="Sort by"
                  >
                    <option value="updatedAt">Last modified</option>
                    <option value="createdAt">Created</option>
                  </select>
                </label>
              )}
            </div>
          </div>

          {currentView === 'tags' && (
            <div className={styles.filters}>
              <div className={styles.tagChips}>
                <button
                  type="button"
                  className={!tagFilterId ? styles.chipActive : styles.chip}
                  onClick={() => setTagFilterId(null)}
                >
                  All groups
                </button>
                <button
                  type="button"
                  className={
                    tagFilterId === '__untagged__'
                      ? styles.chipActive
                      : styles.chip
                  }
                  onClick={() => setTagFilterId('__untagged__')}
                >
                  Untagged
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className={
                      tagFilterId === tag.id ? styles.chipActive : styles.chip
                    }
                    onClick={() => setTagFilterId(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!ready ? (
          <p className={styles.empty}>Loading notes…</p>
        ) : noteCount === 0 ? (
          <div className={styles.emptyState}>
            <FileText
              size={32}
              aria-hidden="true"
              className={styles.emptyIcon}
            />
            <div className={styles.emptyCopy}>
              <p className={styles.emptyTitle}>Nothing here yet</p>
              <p className={styles.empty}>
                in {activeNotebook?.name ?? 'this notebook'}
              </p>
            </div>
            <Button onClick={openNew}>
              <Plus size={14} aria-hidden="true" />
              New note
            </Button>
          </div>
        ) : (
          <div className={styles.sections}>
            {sections.map((section) => (
              <div key={section.key} className={styles.section}>
                {section.label && (
                  <h2 className={styles.sectionTitle}>{section.label}</h2>
                )}
                <ul className={styles.list}>
                  {section.notes.map((note) => {
                    const locked = noteIsLocked(note)
                    const noteLbId = effectiveLockboxId(workspace, note)
                    const preview = revealed[note.id]
                    const title = displayTitle(note, locked, preview)
                    const body = displayBody(note, locked, preview)
                    const decrypting =
                      !locked && Boolean(note.ciphertext) && !preview
                    const canDrag =
                      currentView === 'book' || currentView === 'custom'
                    return (
                      <li key={note.id} className={styles.listItem}>
                        <div className={styles.rowWrap}>
                          <button
                            type="button"
                            className={styles.row}
                            onClick={() => openNote(note)}
                            draggable={canDrag}
                            onDragStart={() => setDragId(note.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDropReorder(note.id)}
                            onDragEnd={() => setDragId(null)}
                          >
                            <span className={styles.rowTop}>
                              {currentView === 'book' && (
                                <span className={styles.pageNum}>
                                  p.{note.pageNumber}
                                </span>
                              )}
                              {canDrag && (
                                <GripVertical
                                  size={12}
                                  className={styles.grip}
                                  aria-hidden="true"
                                />
                              )}
                              <span className={styles.rowTitle}>{title}</span>
                            </span>
                            <span className={styles.rowMeta}>
                              <span className={styles.rowPreview}>
                                {previewBody(body, locked, decrypting)}
                              </span>
                              <span className={styles.rowTime}>
                                {formatUpdated(note.updatedAt)}
                              </span>
                            </span>
                          </button>
                          {noteLbId && (
                            <LockboxSessionToggle
                              lockboxId={noteLbId}
                              label="note"
                              size={12}
                              className={styles.rowSessionToggle}
                            />
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotebookRow({
  layout = 'list',
  notebook,
  noteCount,
  pinned,
  canDelete = true,
  onOpen,
  onTogglePin,
  onRename,
  onDelete,
}) {
  const meta = `${noteCount} note${noteCount === 1 ? '' : 's'}${
    notebook.lockboxId ? ' · Protected' : ''
  }`

  const actions = (
    <>
      <button
        type="button"
        className={styles.iconAction}
        onClick={(e) => {
          e.stopPropagation()
          onRename()
        }}
        aria-label={`Rename ${notebook.name}`}
        title="Rename"
      >
        <Pencil size={14} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cx(styles.iconAction, styles.iconActionDanger)}
        disabled={!canDelete}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        aria-label={`Delete ${notebook.name}`}
        title="Delete"
      >
        <Trash2 size={14} aria-hidden="true" />
      </button>
    </>
  )

  if (layout === 'tiles') {
    return (
      <li className={styles.tileItem}>
        <div className={styles.tileCard}>
          <button type="button" className={styles.tileMain} onClick={onOpen}>
            <span className={styles.tileTitle}>{notebook.name}</span>
            <span className={styles.tileMeta}>{meta}</span>
          </button>
          <div className={styles.tileActions}>
            {actions}
            <button
              type="button"
              className={cx(styles.pinBtn, pinned && styles.pinBtnActive)}
              onClick={onTogglePin}
              aria-label={
                pinned ? `Unpin ${notebook.name}` : `Pin ${notebook.name}`
              }
              title={pinned ? 'Unpin' : 'Pin'}
            >
              <Pin size={14} aria-hidden="true" />
            </button>
            {notebook.lockboxId && (
              <LockboxSessionToggle
                lockboxId={notebook.lockboxId}
                label="notebook"
                size={12}
              />
            )}
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className={styles.listItem}>
      <div className={styles.rowWrap}>
        <button type="button" className={styles.row} onClick={onOpen}>
          <span className={styles.rowTop}>
            <span className={styles.rowTitle}>{notebook.name}</span>
          </span>
          <span className={styles.rowMeta}>
            <span className={styles.rowPreview}>{meta}</span>
          </span>
        </button>
        {actions}
        <button
          type="button"
          className={cx(styles.pinBtn, pinned && styles.pinBtnActive)}
          onClick={(e) => {
            e.stopPropagation()
            onTogglePin()
          }}
          aria-label={pinned ? `Unpin ${notebook.name}` : `Pin ${notebook.name}`}
          title={pinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={14} aria-hidden="true" />
        </button>
        {notebook.lockboxId && (
          <LockboxSessionToggle
            lockboxId={notebook.lockboxId}
            label="notebook"
            size={12}
            className={styles.rowSessionToggle}
          />
        )}
      </div>
    </li>
  )
}
