import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useNotes } from '@/providers/NotesProvider'
import { enqueueSyncOp } from '@/lib/supabaseSync'
import {
  fetchRemoteWorkspace,
  fetchWorkspaceSemver,
  pushWorkspace,
  saveWorkspaceSemver,
  wipeUserCloudWorkspace,
  workspaceContentFingerprint,
  workspaceHasUserContent,
  workspaceMaxUpdatedAt,
} from '@/lib/notasApi'
import {
  emptyWorkspace,
  normalizeWorkspace,
  serializeWorkspace,
  WORKSPACE_STORAGE_KEY,
} from '@/lib/workspaceModel'
import {
  isWipeSemver,
  normalizeSemver,
  SEMVER_FRESH,
  SEMVER_SEEDED,
} from '@/lib/workspaceSemver'
import { asyncStorage } from '@/lib/storage'

const PUSH_MAX_ATTEMPTS = 3
const PULL_FOCUS_MIN_MS = 5_000

// Sync local workspace ↔ notas_* tables (not user_data).
// Login always pulls cloud content. Semver guards seed/wipe; never push a
// stock empty seed over remote data.
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
        semver: normalizeSemver(remote.semver ?? live.semver),
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

  const persistLocal = useCallback(
    async (next) => {
      const normalized = normalizeWorkspace(next)
      setWorkspaceFromRemote(normalized)
      await asyncStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        serializeWorkspace(normalized),
      )
      workspaceRef.current = normalized
      return normalized
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
        const live = normalizeWorkspace(workspaceRef.current)
        const remoteSemver = await fetchWorkspaceSemver(activeUserId)

        // Intentional wipe sentinel — clear cloud + local, never invent -1 here.
        if (isWipeSemver(remoteSemver)) {
          await wipeUserCloudWorkspace(activeUserId)
          const wiped = emptyWorkspace()
          await persistLocal(wiped)
          lastPushedFpRef.current = workspaceContentFingerprint(wiped)
          userDirtyRef.current = false
          return
        }

        const remote = await fetchRemoteWorkspace(activeUserId)

        // Empty cloud: seed Napkin Notes at 0.0.1 (or push existing local content).
        if (!remote) {
          let seed = live
          if (!workspaceHasUserContent(seed)) {
            seed = emptyWorkspace()
          }
          if (normalizeSemver(seed.semver) === SEMVER_FRESH) {
            seed = { ...seed, semver: SEMVER_SEEDED }
          }
          seed = await persistLocal(seed)
          await saveWorkspaceSemver(activeUserId, seed.semver)
          await schedulePush(`${reason}-seed`)
          return
        }

        // Existing cloud content with missing/fresh meta → mark seeded once.
        let remoteWs = normalizeWorkspace(remote)
        if (
          normalizeSemver(remoteSemver) === SEMVER_FRESH &&
          workspaceHasUserContent(remoteWs)
        ) {
          await saveWorkspaceSemver(activeUserId, SEMVER_SEEDED)
          remoteWs = { ...remoteWs, semver: SEMVER_SEEDED }
        } else {
          remoteWs = {
            ...remoteWs,
            semver: normalizeSemver(remoteWs.semver || remoteSemver),
          }
        }

        const liveFp = workspaceContentFingerprint(live)
        const remoteFp = workspaceContentFingerprint(remoteWs)
        if (liveFp === remoteFp) {
          lastPushedFpRef.current = liveFp
          userDirtyRef.current = false
          // Keep local semver aligned with cloud.
          if (normalizeSemver(live.semver) !== normalizeSemver(remoteWs.semver)) {
            await persistLocal({ ...live, semver: remoteWs.semver })
          }
          return
        }

        // Login / idle focus: always take cloud. Never push stock empty over it.
        if (reason === 'initial' || !userDirtyRef.current) {
          await applyRemote(remoteWs, live)
          return
        }

        // Local note/notebook edits pending — push those.
        await schedulePush(`${reason}-dirty`)
      } finally {
        pullingRef.current = false
      }
    },
    [applyRemote, persistLocal, schedulePush],
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
