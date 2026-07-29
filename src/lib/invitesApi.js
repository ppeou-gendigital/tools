// Invite join flow for the demo workspaces table.
// After init-tool, `toolname_*` RPC/table names become your tool's kebab id.
//
// See supabase/template_invites.sql. Specialize for your domain by renaming
// workspace → journey / vault / notebook and extending accept side-effects.

import { supabase } from '@/lib/supabase'

export const INVITES_TABLE = 'toolname_invites'
export const WORKSPACES_TABLE = 'toolname_workspaces'
export const WORKSPACE_MEMBERS_TABLE = 'toolname_workspace_members'

function mapWorkspace(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapMember(row) {
  if (!row) return null
  return {
    workspaceId: row.workspace_id,
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
  }
}

function mapInvite(row) {
  if (!row) return null
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    token: row.token,
    role: row.role,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    email: row.email ?? null,
  }
}

export async function createWorkspace(title) {
  const { data, error } = await supabase.rpc('toolname_create_workspace', {
    p_title: title,
  })
  if (error) throw error
  return mapWorkspace(data)
}

export async function listWorkspaces() {
  const { data, error } = await supabase
    .from(WORKSPACES_TABLE)
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapWorkspace)
}

export async function getWorkspace(workspaceId) {
  const { data, error } = await supabase
    .from(WORKSPACES_TABLE)
    .select('*')
    .eq('id', workspaceId)
    .maybeSingle()
  if (error) throw error
  return mapWorkspace(data)
}

export async function listMembers(workspaceId) {
  const { data, error } = await supabase
    .from(WORKSPACE_MEMBERS_TABLE)
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('joined_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapMember)
}

export async function myMembership(workspaceId) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) return null
  const { data, error } = await supabase
    .from(WORKSPACE_MEMBERS_TABLE)
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) throw error
  return mapMember(data)
}

export async function createInvite(
  workspaceId,
  role,
  expiresAt,
  { email = null } = {},
) {
  const { data, error } = await supabase.rpc('toolname_create_invite', {
    p_workspace_id: workspaceId,
    p_role: role,
    p_expires_at: expiresAt,
    p_email: email,
  })
  if (error) throw error
  return mapInvite(data)
}

export async function listInvites(workspaceId) {
  const { data, error } = await supabase
    .from(INVITES_TABLE)
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapInvite)
}

export async function revokeInvite(inviteId) {
  const { data, error } = await supabase.rpc('toolname_revoke_invite', {
    p_invite_id: inviteId,
  })
  if (error) throw error
  return mapInvite(data)
}

export async function peekInvite(token) {
  const { data, error } = await supabase.rpc('toolname_peek_invite', {
    p_token: token,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return {
    workspaceId: row.workspace_id,
    workspaceTitle: row.workspace_title,
    role: row.role,
    expiresAt: row.expires_at,
    revoked: row.revoked,
  }
}

export async function acceptInvite(token) {
  const { data, error } = await supabase.rpc('toolname_accept_invite', {
    p_token: token,
  })
  if (error) throw error
  return mapMember(data)
}

/** Build a shareable join URL: origin + path + ?invite=TOKEN */
export function inviteUrl(token) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : ''
  const path =
    typeof window !== 'undefined' ? window.location.pathname : '/'
  return `${origin}${path}?invite=${encodeURIComponent(token)}`
}

export function isInviteOpen(inv, now = Date.now()) {
  if (!inv || inv.revokedAt) return false
  if (inv.expiresAt == null) return true
  return new Date(inv.expiresAt).getTime() > now
}

export function labelForInviteRole(role) {
  if (role === 'owner') return 'Owner'
  if (role === 'editor') return 'Editor'
  if (role === 'viewer') return 'Viewer'
  return role || 'Member'
}
