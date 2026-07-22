import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { useAuth } from '@/providers/AuthProvider'
import {
  LEGACY_DEFAULT_NOTEBOOK_NAME,
  LEGACY_NOTES_KEY,
  WORKSPACE_STORAGE_KEY,
  buildNoteSections,
  classifyNotebookNotes,
  createId,
  emptyWorkspace,
  migrateLegacyNotes,
  normalizeTagName,
  normalizeTimelineField,
  normalizeViewMode,
  notebookIdsForNote,
  notebooksForNote,
  normalizeWorkspace,
  notesInNotebook,
  parseWorkspaceJson,
  pinNotebookId,
  renumberPages,
  reindexSortKeys,
  serializeWorkspace,
  tagsForNote,
  unpinNotebookId,
} from '@/lib/workspaceModel'
import { bumpMinor, bumpPatch, normalizeSemver } from '@/lib/workspaceSemver'
import {
  assertContentEditAllowed,
  runPulledMutation,
} from '@/lib/workspaceSyncOps'

const NotesContext = createContext(null)

function rawHasLegacyDefaultNotebook(raw) {
  try {
    const obj = JSON.parse(raw)
    return (
      Array.isArray(obj?.notebooks) &&
      obj.notebooks.some(
        (n) => String(n?.name ?? '').trim() === LEGACY_DEFAULT_NOTEBOOK_NAME,
      )
    )
  } catch {
    return false
  }
}

/** Persist once to rewrite single notebookId notes → noteNotebooks joins. */
function rawNeedsNoteNotebookMigration(raw) {
  try {
    const obj = JSON.parse(raw)
    if (!Array.isArray(obj?.noteNotebooks)) return true
    return (
      Array.isArray(obj?.notes) &&
      obj.notes.some(
        (n) => typeof n?.notebookId === 'string' && n.notebookId,
      )
    )
  } catch {
    return false
  }
}

async function loadWorkspace() {
  const raw = await asyncStorage.getItem(WORKSPACE_STORAGE_KEY)
  if (raw) {
    const parsed = parseWorkspaceJson(raw)
    if (parsed) {
      return {
        workspace: parsed,
        shouldPersist:
          rawHasLegacyDefaultNotebook(raw) ||
          rawNeedsNoteNotebookMigration(raw),
      }
    }
  }
  const legacy = await asyncStorage.getItem(LEGACY_NOTES_KEY)
  if (legacy) {
    const migrated = migrateLegacyNotes(legacy)
    await asyncStorage.setItem(
      WORKSPACE_STORAGE_KEY,
      serializeWorkspace(migrated),
    )
    await asyncStorage.removeItem(LEGACY_NOTES_KEY)
    return { workspace: migrated, shouldPersist: false }
  }
  return { workspace: emptyWorkspace(), shouldPersist: false }
}

export function NotesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [workspace, setWorkspace] = useState(() => emptyWorkspace())
  const [ready, setReady] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [viewOverride, setViewOverride] = useState(null)
  const [timelineFieldOverride, setTimelineFieldOverride] = useState(null)
  const [tagFilterId, setTagFilterId] = useState(null)
  const workspaceRef = useRef(workspace)
  const persistGeneration = useRef(0)
  const onPersistRef = useRef(null)
  const markPushedRef = useRef(null)
  const userIdRef = useRef(userId)

  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  const persist = useCallback(async (next, options = {}) => {
    const awaitSync = Boolean(options.awaitSync)
    const skipSync = Boolean(options.skipSync)
    const normalized = normalizeWorkspace({
      ...next,
      // Mark every local write (create/update/delete) so pull won't treat a
      // stale remote snapshot as newer after removals.
      revisedAt: new Date().toISOString(),
    })
    workspaceRef.current = normalized
    setWorkspace(normalized)
    const gen = ++persistGeneration.current
    await asyncStorage.setItem(
      WORKSPACE_STORAGE_KEY,
      serializeWorkspace(normalized),
    )
    if (skipSync) return normalized
    if (gen === persistGeneration.current && onPersistRef.current) {
      const syncResult = onPersistRef.current(normalized)
      if (syncResult != null && typeof syncResult.then === 'function') {
        if (awaitSync) {
          try {
            await syncResult
          } catch (err) {
            const syncErr = new Error(
              err?.message ??
                'Saved on this device, but sync to the cloud failed.',
            )
            syncErr.cause = err
            syncErr.code = 'WORKSPACE_SYNC_FAILED'
            throw syncErr
          }
        } else {
          syncResult.catch((err) => {
            console.warn(
              '[notas] workspace sync failed:',
              err?.message ?? err,
            )
          })
        }
      }
    }
    return normalized
  }, [])

  const adoptBase = useCallback(async (base) => {
    const normalized = normalizeWorkspace(base)
    workspaceRef.current = normalized
    setWorkspace(normalized)
    await asyncStorage.setItem(
      WORKSPACE_STORAGE_KEY,
      serializeWorkspace(normalized),
    )
  }, [])

  /**
   * Pull → decide → mutate (skipSync) → push.
   * Pass skipRemoteSync on nested calls inside an outer pulled mutation.
   */
  const runSynced = useCallback(
    async (mutate, { decide, skipRemoteSync = false } = {}) => {
      if (skipRemoteSync || !userIdRef.current) {
        return mutate({ skipSync: Boolean(userIdRef.current) })
      }
      return runPulledMutation({
        userId: userIdRef.current,
        getLocal: () => workspaceRef.current,
        adoptBase,
        decide,
        mutate: () => mutate({ skipSync: true }),
        markPushed: (fp) => markPushedRef.current?.(fp),
      })
    },
    [adoptBase],
  )

  useEffect(() => {
    let mounted = true
    loadWorkspace().then(async ({ workspace: ws, shouldPersist }) => {
      if (!mounted) return
      setWorkspace(ws)
      workspaceRef.current = ws
      setReady(true)
      // Persist legacy default rename ("My Notebook" → "Napkin Notes").
      if (shouldPersist && mounted) {
        await persist(ws)
      }
    })
    return () => {
      mounted = false
    }
  }, [persist])

  const setWorkspaceFromRemote = useCallback((remote) => {
    const normalized = normalizeWorkspace(remote)
    workspaceRef.current = normalized
    setWorkspace(normalized)
  }, [])

  const registerPersistHook = useCallback((fn) => {
    onPersistRef.current = fn
    return () => {
      if (onPersistRef.current === fn) onPersistRef.current = null
    }
  }, [])

  const registerMarkPushed = useCallback((fn) => {
    markPushedRef.current = fn
    return () => {
      if (markPushedRef.current === fn) markPushedRef.current = null
    }
  }, [])

  const activeNotebookId = workspace.activeNotebookId
  const activeNotebook =
    workspace.notebooks.find((n) => n.id === activeNotebookId) ??
    workspace.notebooks[0] ??
    null

  const currentView = normalizeViewMode(
    viewOverride ?? activeNotebook?.defaultView ?? 'timeline',
  )
  const currentTimelineField = normalizeTimelineField(
    timelineFieldOverride ?? activeNotebook?.timelineField ?? 'updatedAt',
  )

  const sections = useMemo(() => {
    if (!activeNotebook) return []
    return buildNoteSections(workspace, activeNotebook.id, {
      view: currentView,
      timelineField: currentTimelineField,
      tagFilterId: currentView === 'tags' ? tagFilterId : null,
    })
  }, [
    workspace,
    activeNotebook,
    currentView,
    currentTimelineField,
    tagFilterId,
  ])

  const notes = useMemo(
    () => sections.flatMap((s) => s.notes),
    [sections],
  )

  const getNote = useCallback(
    (id) => workspace.notes.find((n) => n.id === id) ?? null,
    [workspace.notes],
  )

  const getNotebook = useCallback(
    (id) => workspace.notebooks.find((n) => n.id === id) ?? null,
    [workspace.notebooks],
  )

  const setActiveNotebookId = useCallback(
    async (id) => {
      const ws = workspaceRef.current
      if (!ws.notebooks.some((n) => n.id === id)) return
      setViewOverride(null)
      setTimelineFieldOverride(null)
      setTagFilterId(null)
      await persist({ ...ws, activeNotebookId: id })
    },
    [persist],
  )

  const createNotebook = useCallback(
    async ({ name = 'Notebook' } = {}, syncOpts = {}) => {
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        const now = new Date().toISOString()
        const notebook = {
          id: createId(),
          name: String(name).trim() || 'Notebook',
          createdAt: now,
          updatedAt: now,
          defaultView: 'timeline',
          timelineField: 'updatedAt',
          lockboxId: null,
        }
        await persist(
          {
            ...ws,
            notebooks: [...ws.notebooks, notebook],
            activeNotebookId: notebook.id,
          },
          { skipSync },
        )
        setViewOverride(null)
        setTagFilterId(null)
        return notebook
      }, syncOpts)
    },
    [persist, runSynced],
  )

  const updateNotebook = useCallback(
    async (id, patch = {}, syncOpts = {}) => {
      const baselineUpdatedAt =
        workspaceRef.current.notebooks.find((n) => n.id === id)?.updatedAt ??
        null
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          const now = new Date().toISOString()
          let updated = null
          const notebooks = ws.notebooks.map((nb) => {
            if (nb.id !== id) return nb
            updated = {
              ...nb,
              name:
                patch.name !== undefined
                  ? String(patch.name).trim() || nb.name
                  : nb.name,
              defaultView:
                patch.defaultView !== undefined
                  ? normalizeViewMode(patch.defaultView)
                  : nb.defaultView,
              timelineField:
                patch.timelineField !== undefined
                  ? normalizeTimelineField(patch.timelineField)
                  : nb.timelineField,
              lockboxId:
                patch.lockboxId !== undefined
                  ? patch.lockboxId || null
                  : nb.lockboxId,
              updatedAt: now,
            }
            return updated
          })
          if (!updated) return null
          await persist({ ...ws, notebooks }, { skipSync })
          return updated
        },
        {
          ...syncOpts,
          decide: (base) => {
            assertContentEditAllowed(
              base.notebooks.find((n) => n.id === id),
              baselineUpdatedAt,
              'notebook',
            )
          },
        },
      )
    },
    [persist, runSynced],
  )

  const deleteNotebook = useCallback(
    async (id, options = {}) => {
      const syncOpts = options.skipRemoteSync
        ? { skipRemoteSync: true }
        : {}
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        if (ws.notebooks.length <= 1) {
          throw new Error('Cannot delete the last notebook.')
        }
        if (!ws.notebooks.some((n) => n.id === id)) {
          return // already gone remotely
        }

        const disposition =
          options.disposition === 'transfer' ? 'transfer' : 'delete'
        const transferToId =
          typeof options.transferToId === 'string' ? options.transferToId : null

        const { exclusiveIds } = classifyNotebookNotes(ws, id)

        if (exclusiveIds.length > 0 && disposition === 'transfer') {
          if (
            !transferToId ||
            transferToId === id ||
            !ws.notebooks.some((n) => n.id === transferToId)
          ) {
            throw new Error('Choose a notebook to transfer notes to.')
          }
        }

        const exclusiveSet = new Set(exclusiveIds)
        const notebooks = ws.notebooks.filter((n) => n.id !== id)

        let noteNotebooks = (ws.noteNotebooks || []).filter(
          (jt) => jt.notebookId !== id,
        )

        if (disposition === 'transfer' && exclusiveIds.length > 0) {
          const existing = new Set(
            noteNotebooks.map((jt) => `${jt.noteId}:${jt.notebookId}`),
          )
          for (const noteId of exclusiveIds) {
            const key = `${noteId}:${transferToId}`
            if (existing.has(key)) continue
            existing.add(key)
            noteNotebooks.push({ noteId, notebookId: transferToId })
          }
        }

        const deleteExclusive = disposition === 'delete' && exclusiveSet.size > 0
        const notesNext = deleteExclusive
          ? ws.notes.filter((n) => !exclusiveSet.has(n.id))
          : ws.notes
        const noteTags = deleteExclusive
          ? ws.noteTags.filter((jt) => !exclusiveSet.has(jt.noteId))
          : ws.noteTags

        if (deleteExclusive) {
          noteNotebooks = noteNotebooks.filter(
            (jt) => !exclusiveSet.has(jt.noteId),
          )
        }

        let activeNotebookIdNext =
          ws.activeNotebookId === id ? notebooks[0].id : ws.activeNotebookId
        if (
          disposition === 'transfer' &&
          transferToId &&
          ws.activeNotebookId === id
        ) {
          activeNotebookIdNext = transferToId
        }

        await persist(
          {
            ...ws,
            notebooks,
            notes: notesNext,
            noteTags,
            noteNotebooks,
            activeNotebookId: activeNotebookIdNext,
            pinnedNotebookIds: unpinNotebookId(ws.pinnedNotebookIds, id),
          },
          { skipSync },
        )
        if (activeNoteId && deleteExclusive && exclusiveSet.has(activeNoteId)) {
          setActiveNoteId(null)
        }
      }, {
        ...syncOpts,
        decide: (base) => {
          if (!base.notebooks.some((n) => n.id === id)) return false
        },
      })
    },
    [activeNoteId, persist, runSynced],
  )

  const setNotebookPinned = useCallback(
    async (id, pinned) => {
      const ws = workspaceRef.current
      if (!ws.notebooks.some((n) => n.id === id)) return
      const pinnedNotebookIds = pinned
        ? pinNotebookId(ws.pinnedNotebookIds, id)
        : unpinNotebookId(ws.pinnedNotebookIds, id)
      await persist({ ...ws, pinnedNotebookIds })
    },
    [persist],
  )

  const createNote = useCallback(
    async (
      {
        title = '',
        body = '',
        notebookId,
        notebookIds,
        ciphertext = null,
        iv = null,
        lockboxId = null,
      } = {},
      syncOpts = {},
    ) => {
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        const requested = Array.isArray(notebookIds)
          ? notebookIds
          : notebookId
            ? [notebookId]
            : [ws.activeNotebookId]
        const memberIds = [
          ...new Set(
            requested.filter((id) => ws.notebooks.some((n) => n.id === id)),
          ),
        ]
        const ids =
          memberIds.length > 0
            ? memberIds
            : [ws.activeNotebookId].filter(Boolean)
        if (ids.length === 0) {
          throw new Error('createNote: no notebook available')
        }
        const siblings = notesInNotebook(ws, ids[0])
        const now = new Date().toISOString()
        const locked = Boolean(ciphertext && iv)
        const note = {
          id: createId(),
          title: locked
            ? 'Locked note'
            : String(title ?? '').trim() || 'Untitled',
          body: locked ? '' : String(body ?? ''),
          createdAt: now,
          updatedAt: now,
          pageNumber: siblings.length + 1,
          sortKey: siblings.length,
          lockboxId: lockboxId || null,
          ciphertext: locked ? ciphertext : null,
          iv: locked ? iv : null,
        }
        const noteNotebooks = [
          ...(ws.noteNotebooks || []),
          ...ids.map((nbId) => ({ noteId: note.id, notebookId: nbId })),
        ]
        await persist(
          {
            ...ws,
            notes: [note, ...ws.notes],
            noteNotebooks,
          },
          { skipSync },
        )
        return note
      }, syncOpts)
    },
    [persist, runSynced],
  )

  const updateNote = useCallback(
    async (id, patch = {}, syncOpts = {}) => {
      const baselineUpdatedAt =
        workspaceRef.current.notes.find((n) => n.id === id)?.updatedAt ?? null
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          let updated = null
          const notes = ws.notes.map((n) => {
            if (n.id !== id) return n
            const next = { ...n, updatedAt: new Date().toISOString() }
            if (patch.title !== undefined) {
              next.title = String(patch.title ?? '').trim() || 'Untitled'
            }
            if (patch.body !== undefined) {
              next.body = String(patch.body ?? '')
            }
            if (patch.pageNumber !== undefined) {
              next.pageNumber = Number(patch.pageNumber) || 0
            }
            if (patch.sortKey !== undefined) {
              next.sortKey = Number(patch.sortKey) || 0
            }
            if (patch.lockboxId !== undefined) {
              next.lockboxId = patch.lockboxId || null
            }
            if (patch.ciphertext !== undefined) {
              next.ciphertext = patch.ciphertext || null
            }
            if (patch.iv !== undefined) {
              next.iv = patch.iv || null
            }
            if (patch.clearPlaintext) {
              next.title = patch.title ?? 'Locked note'
              next.body = ''
            }
            if (patch.decryptPlaintext) {
              next.ciphertext = null
              next.iv = null
            }
            updated = next
            return next
          })
          if (!updated) return null
          await persist({ ...ws, notes }, { skipSync })
          return updated
        },
        {
          ...syncOpts,
          decide: (base) => {
            assertContentEditAllowed(
              base.notes.find((n) => n.id === id),
              baselineUpdatedAt,
              'note',
            )
          },
        },
      )
    },
    [persist, runSynced],
  )

  const deleteNote = useCallback(
    async (id, syncOpts = {}) => {
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          if (!ws.notes.some((n) => n.id === id)) return
          const notes = ws.notes.filter((n) => n.id !== id)
          const noteTags = ws.noteTags.filter((jt) => jt.noteId !== id)
          const noteNotebooks = (ws.noteNotebooks || []).filter(
            (jt) => jt.noteId !== id,
          )
          await persist(
            { ...ws, notes, noteTags, noteNotebooks },
            { skipSync },
          )
          if (activeNoteId === id) setActiveNoteId(null)
        },
        {
          ...syncOpts,
          decide: (base) => {
            if (!base.notes.some((n) => n.id === id)) return false
          },
        },
      )
    },
    [activeNoteId, persist, runSynced],
  )

  const reorderNotes = useCallback(
    async (notebookId, orderedIds, mode = 'custom', syncOpts = {}) => {
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        const memberIds = new Set(
          (ws.noteNotebooks || [])
            .filter((jt) => jt.notebookId === notebookId)
            .map((jt) => jt.noteId),
        )
        const idSet = new Set(orderedIds)
        const ordered = orderedIds
          .map((id) =>
            memberIds.has(id) ? ws.notes.find((n) => n.id === id) : null,
          )
          .filter(Boolean)
        if (ordered.length === 0) return
        let patched = ordered
        if (mode === 'book') patched = renumberPages(ordered)
        else patched = reindexSortKeys(ordered)
        const byId = new Map(patched.map((n) => [n.id, n]))
        const now = new Date().toISOString()
        const notes = ws.notes.map((n) => {
          if (!idSet.has(n.id)) return n
          const next = byId.get(n.id) ?? n
          return { ...next, updatedAt: now }
        })
        await persist({ ...ws, notes }, { skipSync })
      }, syncOpts)
    },
    [persist, runSynced],
  )

  const upsertTag = useCallback(
    async (name, syncOpts = {}) => {
      const normalized = normalizeTagName(name)
      if (!normalized) return null
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        const existing = ws.tags.find(
          (t) => t.name.toLowerCase() === normalized.toLowerCase(),
        )
        if (existing) return existing
        const tag = { id: createId(), name: normalized }
        await persist({ ...ws, tags: [...ws.tags, tag] }, { skipSync })
        return tag
      }, syncOpts)
    },
    [persist, runSynced],
  )

  const setNoteTags = useCallback(
    async (noteId, tagNames, syncOpts = {}) => {
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          if (!ws.notes.some((n) => n.id === noteId)) return []
          const names = [
            ...new Set(
              (tagNames ?? [])
                .map(normalizeTagName)
                .filter(Boolean)
                .map((n) => n.toLowerCase()),
            ),
          ]
          let tags = [...ws.tags]
          const resolved = []
          for (const lower of names) {
            let tag = tags.find((t) => t.name.toLowerCase() === lower)
            if (!tag) {
              const original = (tagNames ?? []).find(
                (n) => normalizeTagName(n).toLowerCase() === lower,
              )
              tag = { id: createId(), name: normalizeTagName(original) }
              tags = [...tags, tag]
            }
            resolved.push(tag)
          }
          const otherJoins = ws.noteTags.filter((jt) => jt.noteId !== noteId)
          const noteTags = [
            ...otherJoins,
            ...resolved.map((t) => ({ noteId, tagId: t.id })),
          ]
          const used = new Set(noteTags.map((jt) => jt.tagId))
          tags = tags.filter((t) => used.has(t.id))
          await persist({ ...ws, tags, noteTags }, { skipSync })
          return resolved
        },
        {
          ...syncOpts,
          decide: (base) => {
            if (!base.notes.some((n) => n.id === noteId)) return false
          },
        },
      )
    },
    [persist, runSynced],
  )

  const setNoteNotebooks = useCallback(
    async (noteId, notebookIds, syncOpts = {}) => {
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          if (!ws.notes.some((n) => n.id === noteId)) return []
          const ids = [
            ...new Set(
              (notebookIds ?? []).filter((id) =>
                ws.notebooks.some((n) => n.id === id),
              ),
            ),
          ]
          if (ids.length === 0) {
            throw new Error('Select at least one notebook.')
          }
          const other = (ws.noteNotebooks || []).filter(
            (jt) => jt.noteId !== noteId,
          )
          const noteNotebooks = [
            ...other,
            ...ids.map((notebookId) => ({ noteId, notebookId })),
          ]
          await persist({ ...ws, noteNotebooks }, { skipSync })
          return ids
        },
        {
          ...syncOpts,
          decide: (base) => {
            if (!base.notes.some((n) => n.id === noteId)) return false
          },
        },
      )
    },
    [persist, runSynced],
  )

  const getTagsForNote = useCallback(
    (noteId) => tagsForNote(workspace, noteId),
    [workspace],
  )

  const getNotebooksForNote = useCallback(
    (noteId) => notebooksForNote(workspace, noteId),
    [workspace],
  )

  const getNotebookIdsForNote = useCallback(
    (noteId) => notebookIdsForNote(workspace, noteId),
    [workspace],
  )

  const upsertLockboxMeta = useCallback(
    async (meta, syncOpts = {}) => {
      return runSynced(async ({ skipSync }) => {
        const ws = workspaceRef.current
        const existing = ws.lockboxes.find((l) => l.id === meta.id)
        const lockboxes = existing
          ? ws.lockboxes.map((l) => (l.id === meta.id ? { ...l, ...meta } : l))
          : [...ws.lockboxes, meta]
        // Add lockbox → minor; update existing → patch.
        const semver = existing
          ? bumpPatch(normalizeSemver(ws.semver))
          : bumpMinor(normalizeSemver(ws.semver))
        await persist({ ...ws, lockboxes, semver }, { skipSync })
        return meta
      }, syncOpts)
    },
    [persist, runSynced],
  )

  const removeLockboxMeta = useCallback(
    async (lockboxId, syncOpts = {}) => {
      return runSynced(
        async ({ skipSync }) => {
          const ws = workspaceRef.current
          const lockboxes = ws.lockboxes.filter((l) => l.id !== lockboxId)
          const notebooks = ws.notebooks.map((nb) =>
            nb.lockboxId === lockboxId ? { ...nb, lockboxId: null } : nb,
          )
          const notes = ws.notes.map((n) => {
            if (n.lockboxId !== lockboxId) return n
            return { ...n, lockboxId: null }
          })
          const semver = bumpMinor(normalizeSemver(ws.semver))
          await persist(
            { ...ws, lockboxes, notebooks, notes, semver },
            { skipSync },
          )
        },
        {
          ...syncOpts,
          decide: (base) => {
            if (!base.lockboxes.some((l) => l.id === lockboxId)) return false
          },
        },
      )
    },
    [persist, runSynced],
  )

  const setLockboxIdleTimeoutMs = useCallback(
    async (ms) => {
      const ws = workspaceRef.current
      await persist({ ...ws, lockboxIdleTimeoutMs: ms })
    },
    [persist],
  )

  const setNotebookViewPrefs = useCallback(
    async (view, timelineField) => {
      if (!activeNotebook) return
      setViewOverride(view)
      if (timelineField) setTimelineFieldOverride(timelineField)
      await updateNotebook(activeNotebook.id, {
        defaultView: view,
        ...(timelineField ? { timelineField } : {}),
      })
    },
    [activeNotebook, updateNotebook],
  )

  const value = useMemo(
    () => ({
      ready,
      workspace,
      notebooks: workspace.notebooks,
      tags: workspace.tags,
      lockboxes: workspace.lockboxes,
      notes,
      sections,
      activeNotebookId,
      activeNotebook,
      activeNoteId,
      setActiveNoteId,
      setActiveNotebookId,
      currentView,
      currentTimelineField,
      setViewOverride,
      setTimelineFieldOverride,
      tagFilterId,
      setTagFilterId,
      setNotebookViewPrefs,
      getNote,
      getNotebook,
      getTagsForNote,
      getNotebooksForNote,
      getNotebookIdsForNote,
      createNotebook,
      updateNotebook,
      deleteNotebook,
      setNotebookPinned,
      pinnedNotebookIds: workspace.pinnedNotebookIds ?? [],
      createNote,
      updateNote,
      deleteNote,
      reorderNotes,
      upsertTag,
      setNoteTags,
      setNoteNotebooks,
      upsertLockboxMeta,
      removeLockboxMeta,
      setLockboxIdleTimeoutMs,
      setWorkspaceFromRemote,
      registerPersistHook,
      registerMarkPushed,
      /** Run fn inside one pull→push; use skipRemoteSync on nested mutators. */
      runPulledWorkspaceOp: (fn) => runSynced(async () => fn()),
      persistWorkspace: persist,
    }),
    [
      ready,
      workspace,
      notes,
      sections,
      activeNotebookId,
      activeNotebook,
      activeNoteId,
      currentView,
      currentTimelineField,
      tagFilterId,
      setActiveNotebookId,
      setNotebookViewPrefs,
      getNote,
      getNotebook,
      getTagsForNote,
      getNotebooksForNote,
      getNotebookIdsForNote,
      createNotebook,
      updateNotebook,
      deleteNotebook,
      setNotebookPinned,
      createNote,
      updateNote,
      deleteNote,
      reorderNotes,
      upsertTag,
      setNoteTags,
      setNoteNotebooks,
      upsertLockboxMeta,
      removeLockboxMeta,
      setLockboxIdleTimeoutMs,
      setWorkspaceFromRemote,
      registerPersistHook,
      registerMarkPushed,
      runSynced,
      persist,
    ],
  )

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) {
    throw new Error('useNotes must be used inside <NotesProvider>')
  }
  return ctx
}
