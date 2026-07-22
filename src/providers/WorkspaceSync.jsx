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

// Login: pull / seed / wipe only.
// Mutations: pull-before-op in NotesProvider (workspaceSyncOps).
// Focus: flush dirty push only — never applyRemote (avoids wiping new lockboxes).
export function WorkspaceSync() {
  const { user, loading: authLoading } = useAuth()
  const {
    ready,
    workspace,
    setWorkspaceFromRemote,
    registerPersistHook,
    registerMarkPushed,
  } = useNotes()

  const userId = user?.id ?? null
  const initialPulledForUserRef = useRef(null)
  const userDirtyRef = useRef(false)
  const workspaceRef = useRef(workspace)
  const lastPushedFpRef = useRef(null)
  const userIdRef = useRef(userId)
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

  useEffect(() => {
    return registerMarkPushed((fp) => {
      lastPushedFpRef.current = fp
      userDirtyRef.current = false
    })
  }, [registerMarkPushed])

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
      workspaceRef.current = normalized
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

  /** Login-only reconcile: wipe / seed / pull. Never used on focus. */
  const pullOnLogin = useCallback(async () => {
    const activeUserId = userIdRef.current
    if (!activeUserId || pullingRef.current) return
    pullingRef.current = true
    try {
      const live = normalizeWorkspace(workspaceRef.current)
      const remoteSemver = await fetchWorkspaceSemver(activeUserId)

      if (isWipeSemver(remoteSemver)) {
        await wipeUserCloudWorkspace(activeUserId)
        const wiped = emptyWorkspace()
        await persistLocal(wiped)
        lastPushedFpRef.current = workspaceContentFingerprint(wiped)
        userDirtyRef.current = false
        return
      }

      const remote = await fetchRemoteWorkspace(activeUserId)
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
        await schedulePush('login-seed')
        return
      }

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

      await applyRemote(remoteWs, live)
    } finally {
      pullingRef.current = false
    }
  }, [applyRemote, persistLocal, schedulePush])

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
      if (!userDirtyRef.current) return
      schedulePush('focus-dirty').catch((err) => {
        console.warn(
          '[notas] focus workspace flush failed:',
          err?.message ?? err,
        )
      })
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [userId, ready, schedulePush])

  useEffect(() => {
    if (authLoading || !userId || !ready) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        await pullOnLogin()
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[notas] workspace auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, userId, ready, pullOnLogin])

  return null
}
