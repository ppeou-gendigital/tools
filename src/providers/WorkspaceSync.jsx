import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useNotes } from '@/providers/NotesProvider'
import { enqueueSyncOp } from '@/lib/supabaseSync'
import {
  fetchRemoteWorkspace,
  pushWorkspace,
  workspaceContentFingerprint,
  workspaceHasUserContent,
  workspaceMaxUpdatedAt,
} from '@/lib/notasApi'
import {
  normalizeWorkspace,
  serializeWorkspace,
  WORKSPACE_STORAGE_KEY,
} from '@/lib/workspaceModel'
import { asyncStorage } from '@/lib/storage'

const PUSH_MAX_ATTEMPTS = 3
const PULL_FOCUS_MIN_MS = 5_000

/**
 * True when every remote notebook/note id exists locally and remote has
 * fewer of at least one — typical of deletes applied in Supabase (or
 * another client) that this device has not absorbed yet.
 */
function remoteIsStrictSubset(local, remote) {
  const localNb = new Set(local.notebooks.map((n) => n.id))
  const localNotes = new Set(local.notes.map((n) => n.id))
  if (!remote.notebooks.every((n) => localNb.has(n.id))) return false
  if (!remote.notes.every((n) => localNotes.has(n.id))) return false
  return (
    remote.notebooks.length < local.notebooks.length ||
    remote.notes.length < local.notes.length ||
    (remote.noteNotebooks?.length ?? 0) < (local.noteNotebooks?.length ?? 0) ||
    remote.tags.length < local.tags.length
  )
}

// Sync local workspace ↔ notas_* tables (not user_data).
// Biometric wraps stay device-local.
export function WorkspaceSync() {
  const { user, loading: authLoading } = useAuth()
  const { ready, workspace, setWorkspaceFromRemote, registerPersistHook } =
    useNotes()

  const userId = user?.id ?? null
  const initialPulledForUserRef = useRef(null)
  // Set only by local user edits (persist hook) — not by push/pull itself.
  const userDirtyRef = useRef(false)
  const workspaceRef = useRef(workspace)
  const lastPushedFpRef = useRef(null)
  const userIdRef = useRef(userId)
  const lastFocusPullAtRef = useRef(0)
  const pullingRef = useRef(false)

  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  useEffect(() => {
    if (!userId) {
      initialPulledForUserRef.current = null
      userDirtyRef.current = false
      lastPushedFpRef.current = null
    }
  }, [userId])

  const applyRemote = useCallback(
    async (remote, live) => {
      const remoteMax = workspaceMaxUpdatedAt(remote)
      const merged = {
        ...remote,
        activeNotebookId: live.notebooks.some(
          (n) => n.id === live.activeNotebookId,
        )
          ? live.activeNotebookId
          : remote.activeNotebookId,
        lockboxIdleTimeoutMs: live.lockboxIdleTimeoutMs,
        pinnedNotebookIds: live.pinnedNotebookIds,
        revisedAt: remote.revisedAt ?? remoteMax,
      }
      const normalized = normalizeWorkspace(merged)
      setWorkspaceFromRemote(normalized)
      await asyncStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        serializeWorkspace(normalized),
      )
      lastPushedFpRef.current = workspaceContentFingerprint(normalized)
      userDirtyRef.current = false
    },
    [setWorkspaceFromRemote],
  )

  const schedulePush = useCallback((reason) => {
    const uid = userIdRef.current
    if (!uid) return Promise.resolve()
    return enqueueSyncOp({
      stream: 'prefs',
      key: 'notas-workspace',
      fn: async () => {
        const activeUserId = userIdRef.current
        if (!activeUserId) return

        let lastErr = null
        for (let attempt = 1; attempt <= PUSH_MAX_ATTEMPTS; attempt++) {
          const latest = workspaceRef.current
          const fp = workspaceContentFingerprint(latest)
          if (fp === lastPushedFpRef.current) {
            userDirtyRef.current = false
            return
          }
          try {
            await pushWorkspace(activeUserId, latest)
            const afterFp = workspaceContentFingerprint(workspaceRef.current)
            lastPushedFpRef.current = fp
            if (afterFp !== fp) {
              userDirtyRef.current = true
              lastPushedFpRef.current = null
              continue
            }
            userDirtyRef.current = false
            return
          } catch (err) {
            lastErr = err
            console.warn(
              `[notas] workspace push failed (${reason}, attempt ${attempt}/${PUSH_MAX_ATTEMPTS}):`,
              err?.message ?? err,
              err,
            )
            if (attempt < PUSH_MAX_ATTEMPTS) {
              await new Promise((r) => setTimeout(r, 400 * attempt))
            }
          }
        }
        userDirtyRef.current = true
        const message =
          lastErr?.message ??
          (lastErr ? String(lastErr) : 'Workspace sync failed')
        throw new Error(message)
      },
    })
  }, [])

  const reconcileWithRemote = useCallback(
    async (reason) => {
      const activeUserId = userIdRef.current
      if (!activeUserId || pullingRef.current) return
      pullingRef.current = true
      try {
        const localBefore = normalizeWorkspace(workspaceRef.current)
        const remote = await fetchRemoteWorkspace(activeUserId)
        if (!remote) {
          if (
            userDirtyRef.current ||
            workspaceHasUserContent(localBefore) ||
            localBefore.notebooks.length > 0
          ) {
            await schedulePush(`${reason}-empty-remote`)
          }
          return
        }

        const live = normalizeWorkspace(workspaceRef.current)
        const liveFp = workspaceContentFingerprint(live)
        const remoteFp = workspaceContentFingerprint(remote)

        if (liveFp === remoteFp) {
          lastPushedFpRef.current = liveFp
          userDirtyRef.current = false
          return
        }

        if (userDirtyRef.current) {
          await schedulePush(`${reason}-dirty`)
          return
        }

        // No local edits: cloud missing rows we still have → take cloud
        // (Supabase dashboard / other-client deletes). Do not push ghosts.
        if (remoteIsStrictSubset(live, remote)) {
          await applyRemote(remote, live)
          return
        }

        const localMax = workspaceMaxUpdatedAt(live)
        const remoteMax = workspaceMaxUpdatedAt(remote)
        const localMs = localMax ? Date.parse(localMax) : 0
        const remoteMs = remoteMax ? Date.parse(remoteMax) : 0

        if (localMs >= remoteMs) {
          await schedulePush(`${reason}-local-newer`)
          return
        }

        await applyRemote(remote, live)
      } finally {
        pullingRef.current = false
      }
    },
    [applyRemote, schedulePush],
  )

  useEffect(() => {
    if (!userId || !ready) return undefined
    return registerPersistHook((next) => {
      const fp = workspaceContentFingerprint(next)
      if (fp === lastPushedFpRef.current) {
        userDirtyRef.current = false
        return Promise.resolve()
      }
      userDirtyRef.current = true
      return schedulePush('persist')
    })
  }, [userId, ready, registerPersistHook, schedulePush])

  useEffect(() => {
    if (!userId || !ready) return undefined
    const onFocus = () => {
      const now = Date.now()
      if (now - lastFocusPullAtRef.current < PULL_FOCUS_MIN_MS) {
        if (userDirtyRef.current) {
          schedulePush('focus-dirty').catch((err) => {
            console.warn(
              '[notas] focus workspace flush failed:',
              err?.message ?? err,
            )
          })
        }
        return
      }
      lastFocusPullAtRef.current = now
      reconcileWithRemote('focus').catch((err) => {
        console.warn('[notas] focus workspace pull failed:', err?.message ?? err)
      })
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [userId, ready, reconcileWithRemote, schedulePush])

  useEffect(() => {
    if (authLoading || !userId || !ready) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        await reconcileWithRemote('initial')
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[notas] workspace auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, ready, reconcileWithRemote])

  return null
}
