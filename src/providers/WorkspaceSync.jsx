import { useEffect, useRef } from 'react'
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

// Sync local workspace ↔ notas_* tables (not user_data).
// Biometric wraps stay device-local.
export function WorkspaceSync() {
  const { user, loading: authLoading } = useAuth()
  const { ready, workspace, setWorkspaceFromRemote, registerPersistHook } =
    useNotes()

  const userId = user?.id ?? null
  const initialPulledForUserRef = useRef(null)
  const dirtyRef = useRef(false)
  const workspaceRef = useRef(workspace)
  const lastPushedFpRef = useRef(null)
  const userIdRef = useRef(userId)

  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  useEffect(() => {
    if (!userId) {
      initialPulledForUserRef.current = null
      dirtyRef.current = false
      lastPushedFpRef.current = null
    }
  }, [userId])

  function schedulePush(reason) {
    const uid = userIdRef.current
    if (!uid) return Promise.resolve()
    dirtyRef.current = true
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
            dirtyRef.current = false
            return
          }
          try {
            await pushWorkspace(activeUserId, latest)
            const afterFp = workspaceContentFingerprint(workspaceRef.current)
            lastPushedFpRef.current = fp
            if (afterFp !== fp) {
              // Another local edit landed during push — keep going.
              dirtyRef.current = true
              lastPushedFpRef.current = null
              continue
            }
            dirtyRef.current = false
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
        dirtyRef.current = true
        const message =
          lastErr?.message ??
          (lastErr ? String(lastErr) : 'Workspace sync failed')
        throw new Error(message)
      },
    })
  }

  useEffect(() => {
    if (!userId || !ready) return undefined
    const unsub = registerPersistHook((next) => {
      const fp = workspaceContentFingerprint(next)
      if (fp === lastPushedFpRef.current) {
        dirtyRef.current = false
        return Promise.resolve()
      }
      return schedulePush('persist')
    })
    // Auth often resolves after the first local persist — flush now so a
    // delete that happened while signed-in still reaches Supabase.
    schedulePush('hook-attached').catch((err) => {
      console.warn('[notas] initial workspace flush failed:', err?.message ?? err)
    })
    return unsub
  }, [userId, ready, registerPersistHook])

  useEffect(() => {
    if (!userId || !ready) return undefined
    const onFocus = () => {
      if (!dirtyRef.current) return
      const fp = workspaceContentFingerprint(workspaceRef.current)
      if (fp === lastPushedFpRef.current) {
        dirtyRef.current = false
        return
      }
      schedulePush('focus').catch((err) => {
        console.warn('[notas] focus workspace flush failed:', err?.message ?? err)
      })
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [userId, ready])

  useEffect(() => {
    if (authLoading || !userId || !ready) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    const localBefore = normalizeWorkspace(workspaceRef.current)
    const localFp = workspaceContentFingerprint(localBefore)
    let cancelled = false

    ;(async () => {
      try {
        const remote = await fetchRemoteWorkspace(userId)
        if (cancelled) return

        if (!remote) {
          if (
            workspaceHasUserContent(localBefore) ||
            localBefore.notebooks.length > 0
          ) {
            await schedulePush('initial-empty-remote')
          }
          return
        }

        const live = normalizeWorkspace(workspaceRef.current)
        const liveFp = workspaceContentFingerprint(live)
        if (liveFp !== localFp || dirtyRef.current) {
          await schedulePush('dirty-during-pull')
          return
        }

        const remoteFp = workspaceContentFingerprint(remote)
        if (localFp === remoteFp) {
          lastPushedFpRef.current = localFp
          return
        }

        const localMax = workspaceMaxUpdatedAt(localBefore)
        const remoteMax = workspaceMaxUpdatedAt(remote)
        const localMs = localMax ? Date.parse(localMax) : 0
        const remoteMs = remoteMax ? Date.parse(remoteMax) : 0

        if (localMs >= remoteMs) {
          await schedulePush('local-newer')
          return
        }

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
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[notas] workspace auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, ready, setWorkspaceFromRemote])

  return null
}
