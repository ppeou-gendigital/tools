/**
 * Build / refresh a Notas workspace offline pack.
 * Locked notes stay ciphertext; plaintext notes are stored as-is (same as cloud).
 */

import { fetchRemoteWorkspace } from '@/lib/notasApi'
import { normalizeWorkspace } from '@/lib/workspaceModel'
import { deletePack, getPack, listPacks, putPack } from '@/lib/offline/packStore'

export const WORKSPACE_PACK_KIND = 'workspace'
export const WORKSPACE_PACK_SCHEMA = 1
export const TOOL_ID = 'notas'

export async function buildWorkspaceOfflinePack(userId) {
  if (!userId) throw new Error('buildWorkspaceOfflinePack: userId is required')

  const remote = await fetchRemoteWorkspace(userId)
  if (!remote) {
    throw new Error(
      'No workspace data in the cloud yet. Create a notebook online first.',
    )
  }

  const workspace = normalizeWorkspace(remote)
  const noteCount = workspace.notes?.length ?? 0
  const notebookCount = workspace.notebooks?.length ?? 0

  const pack = {
    schemaVersion: WORKSPACE_PACK_SCHEMA,
    toolId: TOOL_ID,
    scopeId: userId,
    kind: WORKSPACE_PACK_KIND,
    title: 'Notas',
    syncedAt: new Date().toISOString(),
    summary: {
      noteCount,
      notebookCount,
      lockboxCount: workspace.lockboxes?.length ?? 0,
    },
    workspace,
  }

  await putPack(pack)
  return pack
}

export async function getWorkspaceOfflinePack(userId) {
  const pack = await getPack(userId)
  if (!pack || pack.kind !== WORKSPACE_PACK_KIND) return null
  return pack
}

export async function removeWorkspaceOfflinePack(userId) {
  await deletePack(userId)
}

export async function listWorkspaceOfflinePacks() {
  const all = await listPacks()
  return all.filter((p) => p.kind === WORKSPACE_PACK_KIND)
}
