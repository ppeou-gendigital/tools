// Pull-before-op sync helpers.
//
// Workspace / lockboxes → semver
// Notes / notebooks / tags → updatedAt + operation type
//
// Flow: pull → decide → apply → push (serialized on notas-workspace queue).

import { enqueueSyncOp } from '@/lib/supabaseSync'
import {
  fetchRemoteWorkspace,
  fetchWorkspaceSemver,
  pushWorkspace,
  saveWorkspaceSemver,
  wipeUserCloudWorkspace,
  workspaceContentFingerprint,
  workspaceHasUserContent,
} from '@/lib/notasApi'
import {
  emptyWorkspace,
  normalizeWorkspace,
} from '@/lib/workspaceModel'
import {
  compareSemver,
  isWipeSemver,
  normalizeSemver,
  SEMVER_FRESH,
  SEMVER_SEEDED,
} from '@/lib/workspaceSemver'

export class SyncOpError extends Error {
  constructor(message, code = 'SYNC_OP') {
    super(message)
    this.name = 'SyncOpError'
    this.code = code
  }
}

/** Keep device-local UI fields when adopting a pulled workspace. */
export function mergeDeviceLocalFields(remote, local) {
  const r = normalizeWorkspace(remote)
  const l = normalizeWorkspace(local)
  const remoteNbIds = new Set(r.notebooks.map((n) => n.id))
  const activeNotebookId =
    typeof l.activeNotebookId === 'string' &&
    remoteNbIds.has(l.activeNotebookId)
      ? l.activeNotebookId
      : r.activeNotebookId
  return normalizeWorkspace({
    ...r,
    activeNotebookId,
    lockboxIdleTimeoutMs: l.lockboxIdleTimeoutMs,
    pinnedNotebookIds: (l.pinnedNotebookIds ?? []).filter((id) =>
      remoteNbIds.has(id),
    ),
    semver: normalizeSemver(r.semver),
  })
}

/**
 * Pull remote workspace + semver. Handles wipe sentinel and empty seed.
 * Does not persist — caller adopts the returned base.
 */
export async function pullOpBase(userId, localWs) {
  const local = normalizeWorkspace(localWs)
  if (!userId) {
    return { status: 'local-only', base: local, semver: normalizeSemver(local.semver) }
  }

  const remoteSemver = await fetchWorkspaceSemver(userId)
  if (isWipeSemver(remoteSemver)) {
    await wipeUserCloudWorkspace(userId)
    return {
      status: 'wiped',
      base: emptyWorkspace(),
      semver: SEMVER_FRESH,
    }
  }

  const remote = await fetchRemoteWorkspace(userId)
  if (!remote) {
    let seed = workspaceHasUserContent(local) ? local : emptyWorkspace()
    if (normalizeSemver(seed.semver) === SEMVER_FRESH) {
      seed = { ...seed, semver: SEMVER_SEEDED }
    }
    seed = normalizeWorkspace(seed)
    return { status: 'seed', base: seed, semver: normalizeSemver(seed.semver) }
  }

  let remoteWs = normalizeWorkspace(remote)
  let semver = normalizeSemver(remoteWs.semver || remoteSemver)
  if (
    normalizeSemver(remoteSemver) === SEMVER_FRESH &&
    workspaceHasUserContent(remoteWs)
  ) {
    semver = SEMVER_SEEDED
    await saveWorkspaceSemver(userId, SEMVER_SEEDED)
  }
  remoteWs = { ...remoteWs, semver }

  // Lockbox path: if remote semver is ahead, base is remote (already).
  // If local semver is ahead, still start from remote content tables but
  // keep the higher semver so the subsequent bump is correct.
  if (compareSemver(local.semver, remoteWs.semver) > 0) {
    remoteWs = { ...remoteWs, semver: normalizeSemver(local.semver) }
  }

  const base = mergeDeviceLocalFields(remoteWs, local)
  return { status: 'ok', base, semver: normalizeSemver(base.semver) }
}

/** Edit guard: missing → error; remote newer updatedAt → stale error. */
export function assertContentEditAllowed(entity, baselineUpdatedAt, label = 'item') {
  if (!entity) {
    throw new SyncOpError(
      `This ${label} was deleted elsewhere. Refresh and try again.`,
      'REMOTE_DELETED',
    )
  }
  if (
    baselineUpdatedAt &&
    entity.updatedAt &&
    Date.parse(entity.updatedAt) > Date.parse(baselineUpdatedAt)
  ) {
    throw new SyncOpError(
      `A newer version of this ${label} exists on the server. Refresh and try again.`,
      'REMOTE_NEWER',
    )
  }
}

/**
 * Serialize pull → decide → mutate → push on the workspace queue.
 *
 * @param {object} opts
 * @param {string|null} opts.userId
 * @param {() => object} opts.getLocal
 * @param {(base: object) => Promise<void>} opts.adoptBase
 * @param {(base: object) => void|false|Promise<void|false>} [opts.decide]
 *        Return false to abort as no-op (e.g. delete already gone).
 * @param {() => Promise<any>} opts.mutate  Must persist with skipSync: true
 * @param {(fp: string) => void} [opts.markPushed]
 */
export async function runPulledMutation({
  userId,
  getLocal,
  adoptBase,
  decide,
  mutate,
  markPushed,
}) {
  if (!userId) {
    return mutate()
  }

  return enqueueSyncOp({
    stream: 'prefs',
    key: 'notas-workspace',
    fn: async () => {
      const local = getLocal()
      const pulled = await pullOpBase(userId, local)

      if (pulled.status === 'wiped') {
        await adoptBase(pulled.base)
        if (markPushed) {
          markPushed(workspaceContentFingerprint(pulled.base))
        }
        throw new SyncOpError(
          'Workspace was reset remotely.',
          'WORKSPACE_WIPED',
        )
      }

      await adoptBase(pulled.base)

      if (pulled.status === 'seed') {
        await saveWorkspaceSemver(userId, pulled.semver)
      }

      if (decide) {
        const ok = await decide(pulled.base)
        if (ok === false) {
          if (markPushed) {
            markPushed(workspaceContentFingerprint(getLocal()))
          }
          return null
        }
      }

      const result = await mutate()
      const latest = getLocal()
      await pushWorkspace(userId, latest)
      if (markPushed) {
        markPushed(workspaceContentFingerprint(latest))
      }
      return result
    },
  })
}
