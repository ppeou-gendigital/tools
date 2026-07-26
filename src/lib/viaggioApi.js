import { supabase } from '@/lib/supabase'
import { resolveSchemaForActivity } from '@/lib/catalog'

function mapJourney(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    preset: row.preset,
    activityPacks: row.activity_packs ?? [],
    defaultTimezone: row.default_timezone,
    defaultCurrency: row.default_currency,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapEntry(row) {
  if (!row) return null
  return {
    id: row.id,
    journeyId: row.journey_id,
    activityId: row.activity_id,
    schema: row.schema,
    title: row.title,
    body: row.body ?? {},
    occursOn: row.occurs_on,
    occursAt: row.occurs_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    startTimezone: row.start_timezone,
    endTimezone: row.end_timezone,
    placeName: row.place_name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    phoneE164: row.phone_e164,
    contactId: row.contact_id,
    details: row.details ?? {},
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapExpense(row) {
  if (!row) return null
  return {
    id: row.id,
    entryId: row.entry_id,
    title: row.title,
    amountCents: Number(row.amount_cents) || 0,
    currency: row.currency,
    paidBy: row.paid_by,
    splitMode: row.split_mode,
    category: row.category,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapMember(row) {
  if (!row) return null
  return {
    journeyId: row.journey_id,
    userId: row.user_id,
    role: row.role,
    displayName: row.displayName ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Batch-load profiles.display_name for co-travelers (needs RLS "read co-travelers"). */
export async function fetchDisplayNames(userIds) {
  const ids = [...new Set((userIds ?? []).filter(Boolean))]
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', ids)
  if (error) throw error
  const map = new Map()
  for (const row of data ?? []) {
    const name = (row.display_name ?? '').trim()
    if (name) map.set(row.id, name)
  }
  return map
}

async function withDisplayNames(rows, userIdKey = 'userId') {
  const names = await fetchDisplayNames(rows.map((r) => r[userIdKey]))
  return rows.map((r) => ({
    ...r,
    displayName: names.get(r[userIdKey]) ?? null,
  }))
}

function mapInvite(row) {
  if (!row) return null
  return {
    id: row.id,
    journeyId: row.journey_id,
    token: row.token,
    role: row.role,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    journeyPersonId: row.journey_person_id ?? null,
    email: row.email ?? null,
  }
}

function mapPerson(row) {
  if (!row) return null
  return {
    id: row.id,
    ownerId: row.owner_id,
    displayName: row.display_name,
    email: row.email ?? null,
    phoneE164: row.phone_e164 ?? null,
    linkedUserId: row.linked_user_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapJourneyPerson(row) {
  if (!row) return null
  return {
    id: row.id,
    journeyId: row.journey_id,
    personId: row.person_id ?? null,
    displayName: row.display_name,
    email: row.email ?? null,
    phoneE164: row.phone_e164 ?? null,
    linkedUserId: row.linked_user_id ?? null,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapPlaylist(row) {
  if (!row) return null
  return {
    id: row.id,
    journeyId: row.journey_id,
    url: row.url,
    title: row.title,
    platform: row.platform,
    sortOrder: row.sort_order,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapPlaceIdea(row) {
  if (!row) return null
  return {
    id: row.id,
    journeyId: row.journey_id,
    googlePlaceId: row.google_place_id ?? null,
    name: row.name,
    address: row.address ?? null,
    lat: row.lat != null ? Number(row.lat) : null,
    lng: row.lng != null ? Number(row.lng) : null,
    note: row.note ?? '',
    sortOrder: row.sort_order,
    entryId: row.entry_id ?? null,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapTodoAssignees(nested) {
  if (!Array.isArray(nested)) return []
  return nested
    .filter((a) => a?.journey_person_id)
    .map((a) => ({
      journeyPersonId: a.journey_person_id,
      done: !!a.done,
      doneAt: a.done_at ?? null,
    }))
}

function mapTodo(row) {
  if (!row) return null
  const assignees = mapTodoAssignees(
    row.assignees ?? row.viaggio_todo_assignees ?? [],
  )
  const assigneeIds = assignees.map((a) => a.journeyPersonId)
  const doneCount = assignees.filter((a) => a.done).length
  // With assignees: overall done = everyone done. Unassigned: todo.done.
  const done =
    assignees.length > 0 ? doneCount === assignees.length : !!row.done
  return {
    id: row.id,
    journeyId: row.journey_id,
    title: row.title,
    notes: row.notes ?? '',
    done,
    dueOn: row.due_on ?? null,
    assignees,
    assigneeJourneyPersonIds: assigneeIds,
    assigneeDoneCount: doneCount,
    sortOrder: row.sort_order,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function fetchTodoAssignees(todoId) {
  const { data, error } = await supabase
    .from('viaggio_todo_assignees')
    .select('journey_person_id, done, done_at')
    .eq('todo_id', todoId)
  if (error) throw error
  return data ?? []
}

async function syncTodoDoneRollup(todoId) {
  const rows = await fetchTodoAssignees(todoId)
  if (rows.length === 0) return null
  const allDone = rows.every((r) => r.done)
  const { data, error } = await supabase
    .from('viaggio_todos')
    .update({ done: allDone, updated_at: new Date().toISOString() })
    .eq('id', todoId)
    .select('*')
    .single()
  if (error) throw error
  return data
}

/**
 * Replace assignees. Preserves done for people who remain.
 * @param {string} todoId
 * @param {string[]} journeyPersonIds
 * @param {{ defaultDone?: boolean }} [opts]
 */
async function replaceTodoAssignees(todoId, journeyPersonIds, opts = {}) {
  const ids = [...new Set((journeyPersonIds ?? []).filter(Boolean))]
  const { defaultDone = false } = opts
  const existing = await fetchTodoAssignees(todoId)
  const prevDone = new Map(
    existing.map((r) => [r.journey_person_id, !!r.done]),
  )

  const { error: delErr } = await supabase
    .from('viaggio_todo_assignees')
    .delete()
    .eq('todo_id', todoId)
  if (delErr) throw delErr

  if (ids.length === 0) return []

  const rows = ids.map((journeyPersonId) => {
    const done =
      prevDone.has(journeyPersonId) ? prevDone.get(journeyPersonId) : defaultDone
    return {
      todo_id: todoId,
      journey_person_id: journeyPersonId,
      done,
      done_at: done ? new Date().toISOString() : null,
    }
  })
  const { data, error: insErr } = await supabase
    .from('viaggio_todo_assignees')
    .insert(rows)
    .select('journey_person_id, done, done_at')
  if (insErr) throw insErr
  return data ?? rows
}

export async function listJourneys() {
  const { data, error } = await supabase
    .from('viaggio_journeys')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapJourney)
}

export async function getJourney(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_journeys')
    .select('*')
    .eq('id', journeyId)
    .maybeSingle()
  if (error) throw error
  return mapJourney(data)
}

export async function createJourney({
  title,
  type,
  preset,
  defaultTimezone,
  defaultCurrency,
  startsOn = null,
  endsOn = null,
  activityPacks = [],
}) {
  const { data, error } = await supabase.rpc('create_journey', {
    p_title: title,
    p_type: type,
    p_preset: preset,
    p_default_timezone: defaultTimezone,
    p_default_currency: defaultCurrency,
    p_starts_on: startsOn,
    p_ends_on: endsOn,
    p_activity_packs: activityPacks,
  })
  if (error) throw error
  return mapJourney(data)
}

export async function updateJourney(journeyId, patch) {
  const row = {}
  if (patch.title != null) row.title = patch.title
  if (patch.startsOn !== undefined) row.starts_on = patch.startsOn
  if (patch.endsOn !== undefined) row.ends_on = patch.endsOn
  if (patch.defaultTimezone != null) row.default_timezone = patch.defaultTimezone
  if (patch.defaultCurrency != null) row.default_currency = patch.defaultCurrency
  if (patch.activityPacks != null) row.activity_packs = patch.activityPacks
  row.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('viaggio_journeys')
    .update(row)
    .eq('id', journeyId)
    .select('*')
    .single()
  if (error) throw error
  return mapJourney(data)
}

export async function updateJourneyPacks(journeyId, packs) {
  const { data, error } = await supabase.rpc('update_journey_packs', {
    p_journey_id: journeyId,
    p_packs: packs,
  })
  if (error) throw error
  return mapJourney(data)
}

export async function deleteJourney(journeyId) {
  const { error } = await supabase
    .from('viaggio_journeys')
    .delete()
    .eq('id', journeyId)
  if (error) throw error
}

export async function listEntries(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_entries')
    .select('*')
    .eq('journey_id', journeyId)
    .order('occurs_at', { ascending: true, nullsFirst: false })
    .order('occurs_on', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapEntry)
}

export async function getEntry(entryId) {
  const { data, error } = await supabase
    .from('viaggio_entries')
    .select('*')
    .eq('id', entryId)
    .maybeSingle()
  if (error) throw error
  return mapEntry(data)
}

export async function upsertEntry(input) {
  const schema =
    input.schema || resolveSchemaForActivity(input.activityId)

  const { data, error } = await supabase.rpc('upsert_entry', {
    p_id: input.id ?? null,
    p_journey_id: input.journeyId,
    p_activity_id: input.activityId,
    p_schema: schema,
    p_title: input.title ?? '',
    p_body: input.body ?? {},
    p_occurs_on: input.occursOn ?? null,
    p_occurs_at: input.occursAt ?? null,
    p_ends_at: input.endsAt ?? null,
    p_timezone: input.timezone ?? null,
    p_start_timezone: input.startTimezone ?? null,
    p_end_timezone: input.endTimezone ?? null,
    p_place_name: input.placeName ?? null,
    p_address: input.address ?? null,
    p_lat: input.lat ?? null,
    p_lng: input.lng ?? null,
    p_phone_e164: input.phoneE164 ?? null,
    p_contact_id: input.contactId ?? null,
    p_details: input.details ?? {},
    p_participant_ids: input.participantIds ?? [],
  })
  if (error) throw error
  return mapEntry(data)
}

/** Flat rows { entryId, journeyPersonId } for all participants on a journey’s entries. */
export async function listEntryParticipants(journeyId) {
  const { data: entries, error: entriesError } = await supabase
    .from('viaggio_entries')
    .select('id')
    .eq('journey_id', journeyId)
  if (entriesError) throw entriesError
  const entryIds = (entries ?? []).map((e) => e.id)
  if (entryIds.length === 0) return []

  const { data, error } = await supabase
    .from('viaggio_entry_participants')
    .select('entry_id, journey_person_id')
    .in('entry_id', entryIds)
  if (error) throw error
  return (data ?? []).map((row) => ({
    entryId: row.entry_id,
    journeyPersonId: row.journey_person_id,
  }))
}

export async function listParticipantsForEntry(entryId) {
  if (!entryId) return []
  const { data, error } = await supabase
    .from('viaggio_entry_participants')
    .select('journey_person_id')
    .eq('entry_id', entryId)
  if (error) throw error
  return (data ?? []).map((row) => row.journey_person_id)
}

export async function deleteEntry(entryId) {
  const { error } = await supabase
    .from('viaggio_entries')
    .delete()
    .eq('id', entryId)
  if (error) throw error
}

export async function listExpensesForEntry(entryId) {
  const { data, error } = await supabase
    .from('viaggio_expenses')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapExpense)
}

export async function listExpensesForJourney(journeyId) {
  const { data: entries, error: e1 } = await supabase
    .from('viaggio_entries')
    .select('id')
    .eq('journey_id', journeyId)
  if (e1) throw e1
  const ids = (entries ?? []).map((e) => e.id)
  if (!ids.length) return []

  const { data, error } = await supabase
    .from('viaggio_expenses')
    .select('*')
    .in('entry_id', ids)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapExpense)
}

export async function getExpense(expenseId) {
  const { data, error } = await supabase
    .from('viaggio_expenses')
    .select('*')
    .eq('id', expenseId)
    .maybeSingle()
  if (error) throw error
  return mapExpense(data)
}

export async function listSplits(expenseId) {
  const { data, error } = await supabase
    .from('viaggio_expense_splits')
    .select('*')
    .eq('expense_id', expenseId)
  if (error) throw error
  return (data ?? []).map((row) => ({
    expenseId: row.expense_id,
    journeyPersonId: row.journey_person_id,
    amountCents: Number(row.amount_cents) || 0,
  }))
}

export async function upsertExpenseWithSplits(input) {
  const { data, error } = await supabase.rpc('upsert_expense_with_splits', {
    p_id: input.id ?? null,
    p_entry_id: input.entryId,
    p_title: input.title ?? '',
    p_amount_cents: input.amountCents,
    p_currency: input.currency,
    p_paid_by: input.paidBy,
    p_split_mode: input.splitMode,
    p_category: input.category ?? null,
    p_splits: (input.splits ?? []).map((s) => ({
      journey_person_id: s.journeyPersonId,
      amount_cents: s.amountCents,
    })),
  })
  if (error) throw error
  return mapExpense(data)
}

export async function deleteExpense(expenseId) {
  const { error } = await supabase
    .from('viaggio_expenses')
    .delete()
    .eq('id', expenseId)
  if (error) throw error
}

export async function listMembers(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_journey_members')
    .select('*')
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return withDisplayNames((data ?? []).map(mapMember))
}

export async function myMembership(journeyId, userId) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('viaggio_journey_members')
    .select('*')
    .eq('journey_id', journeyId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return mapMember(data)
}

export async function listMyPeople() {
  const { data, error } = await supabase
    .from('viaggio_people')
    .select('*')
    .order('display_name', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapPerson)
}

export async function upsertPerson(input) {
  const { data, error } = await supabase.rpc('upsert_person', {
    p_id: input.id ?? null,
    p_display_name: input.displayName,
    p_email: input.email ?? null,
    p_phone_e164: input.phoneE164 ?? null,
  })
  if (error) throw error
  return mapPerson(data)
}

export async function deletePerson(personId) {
  const { error } = await supabase.rpc('delete_person', { p_id: personId })
  if (error) throw error
}

export async function listJourneyPeople(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_journey_people')
    .select('*')
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapJourneyPerson)
}

export async function addJourneyPerson(input) {
  const { data, error } = await supabase.rpc('add_journey_person', {
    p_journey_id: input.journeyId,
    p_person_id: input.personId ?? null,
    p_display_name: input.displayName ?? null,
    p_email: input.email ?? null,
    p_phone_e164: input.phoneE164 ?? null,
  })
  if (error) throw error
  return mapJourneyPerson(data)
}

export async function updateJourneyPerson(input) {
  const { data, error } = await supabase.rpc('update_journey_person', {
    p_id: input.id,
    p_display_name: input.displayName,
    p_email: input.email ?? null,
    p_phone_e164: input.phoneE164 ?? null,
  })
  if (error) throw error
  return mapJourneyPerson(data)
}

export async function removeJourneyPerson(journeyPersonId) {
  const { error } = await supabase.rpc('remove_journey_person', {
    p_id: journeyPersonId,
  })
  if (error) throw error
}

export async function createInvite(
  journeyId,
  role,
  expiresAt,
  { journeyPersonId = null, email = null } = {},
) {
  const { data, error } = await supabase.rpc('create_invite', {
    p_journey_id: journeyId,
    p_role: role,
    p_expires_at: expiresAt,
    p_journey_person_id: journeyPersonId,
    p_email: email,
  })
  if (error) throw error
  return mapInvite(data)
}

/** Send magic-link / invite email via Edge Function. */
export async function sendInviteEmail({ inviteId, journeyId }) {
  const { data, error } = await supabase.functions.invoke(
    'invite-journey-person',
    {
      body: { inviteId, journeyId },
    },
  )
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export async function listInvites(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_invites')
    .select('*')
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapInvite)
}

export async function revokeInvite(inviteId) {
  const { data, error } = await supabase.rpc('revoke_invite', {
    p_invite_id: inviteId,
  })
  if (error) throw error
  return mapInvite(data)
}

export async function peekInvite(token) {
  const { data, error } = await supabase.rpc('peek_invite', {
    p_token: token,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return {
    journeyId: row.journey_id,
    journeyTitle: row.journey_title,
    role: row.role,
    expiresAt: row.expires_at,
    revoked: row.revoked,
  }
}

export async function acceptInvite(token) {
  const { data, error } = await supabase.rpc('accept_invite', {
    p_token: token,
  })
  if (error) throw error
  return mapMember(data)
}

export async function setMemberRole(journeyId, userId, role) {
  const { data, error } = await supabase.rpc('set_member_role', {
    p_journey_id: journeyId,
    p_user_id: userId,
    p_role: role,
  })
  if (error) throw error
  return mapMember(data)
}

export async function removeMember(journeyId, userId) {
  const { error } = await supabase.rpc('remove_member', {
    p_journey_id: journeyId,
    p_user_id: userId,
  })
  if (error) throw error
}

export async function blockMember(journeyId, userId, reason = null) {
  const { error } = await supabase.rpc('block_member', {
    p_journey_id: journeyId,
    p_user_id: userId,
    p_reason: reason,
  })
  if (error) throw error
}

export async function unblockMember(journeyId, userId) {
  const { error } = await supabase.rpc('unblock_member', {
    p_journey_id: journeyId,
    p_user_id: userId,
  })
  if (error) throw error
}

export async function leaveJourney(journeyId) {
  const { error } = await supabase.rpc('leave_journey', {
    p_journey_id: journeyId,
  })
  if (error) throw error
}

export async function listBlocks(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_journey_blocks')
    .select('*')
    .eq('journey_id', journeyId)
  if (error) throw error
  return withDisplayNames(
    (data ?? []).map((row) => ({
      journeyId: row.journey_id,
      userId: row.user_id,
      blockedBy: row.blocked_by,
      reason: row.reason,
      createdAt: row.created_at,
    })),
  )
}

export async function listPlaylist(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_playlist_items')
    .select('*')
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapPlaylist)
}

/** Infer platform label from a media URL for playlist chrome. */
export function detectPlaylistPlatform(url) {
  const raw = String(url || '').trim()
  if (!raw) return null
  let host = ''
  try {
    const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    host = parsed.hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    // Incomplete typing — no badge yet.
    return null
  }
  if (!host) return null
  if (host === 'youtu.be' || host.endsWith('youtube.com')) return 'youtube'
  if (host.endsWith('spotify.com')) return 'spotify'
  if (host.endsWith('music.apple.com') || host.endsWith('itunes.apple.com')) {
    return 'apple_music'
  }
  if (host.endsWith('soundcloud.com')) return 'soundcloud'
  if (host.endsWith('vimeo.com')) return 'vimeo'
  if (host.endsWith('tiktok.com')) return 'tiktok'
  return 'link'
}

export async function addPlaylistItem(journeyId, { url, title, platform }, userId) {
  const trimmed = String(url || '').trim()
  if (!trimmed) throw new Error('URL required')
  let parsed
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error('Enter a valid URL (include https://)')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('URL must start with http:// or https://')
  }

  const { data: existing } = await supabase
    .from('viaggio_playlist_items')
    .select('sort_order')
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1
  const resolvedPlatform = platform || detectPlaylistPlatform(trimmed)

  const { data, error } = await supabase
    .from('viaggio_playlist_items')
    .insert({
      journey_id: journeyId,
      url: trimmed,
      title: title ?? '',
      platform: resolvedPlatform,
      sort_order: nextOrder,
      created_by: userId,
    })
    .select('*')
    .single()
  if (error) throw error
  return mapPlaylist(data)
}

export async function deletePlaylistItem(itemId) {
  const { error } = await supabase
    .from('viaggio_playlist_items')
    .delete()
    .eq('id', itemId)
  if (error) throw error
}

export async function updatePlaylistItem(itemId, { url, title, platform } = {}) {
  const updates = { updated_at: new Date().toISOString() }
  if (title != null) updates.title = String(title)
  if (url != null) {
    const trimmed = String(url || '').trim()
    if (!trimmed) throw new Error('URL required')
    let parsed
    try {
      parsed = new URL(trimmed)
    } catch {
      throw new Error('Enter a valid URL (include https://)')
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('URL must start with http:// or https://')
    }
    updates.url = trimmed
    updates.platform = platform || detectPlaylistPlatform(trimmed)
  } else if (platform != null) {
    updates.platform = platform
  }

  const { data, error } = await supabase
    .from('viaggio_playlist_items')
    .update(updates)
    .eq('id', itemId)
    .select('*')
    .single()
  if (error) throw error
  return mapPlaylist(data)
}

/** Persist playlist order. `orderedIds` is the full id list for the journey. */
export async function reorderPlaylistItems(journeyId, orderedIds) {
  const ids = (orderedIds ?? []).filter(Boolean)
  if (!journeyId || ids.length === 0) return
  const results = await Promise.all(
    ids.map((id, sortOrder) =>
      supabase
        .from('viaggio_playlist_items')
        .update({ sort_order: sortOrder })
        .eq('id', id)
        .eq('journey_id', journeyId),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

export async function listPlaceIdeas(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_place_ideas')
    .select('*')
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapPlaceIdea)
}

export async function addPlaceIdea(
  journeyId,
  { googlePlaceId, name, address, lat, lng, note },
  userId,
) {
  const trimmedName = String(name || '').trim()
  if (!trimmedName) throw new Error('Place name required')
  const latN = Number(lat)
  const lngN = Number(lng)
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) {
    throw new Error('Place coordinates required')
  }

  if (googlePlaceId) {
    const { data: existing } = await supabase
      .from('viaggio_place_ideas')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('google_place_id', googlePlaceId)
      .maybeSingle()
    if (existing) return mapPlaceIdea(existing)
  }

  const { data: last } = await supabase
    .from('viaggio_place_ideas')
    .select('sort_order')
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = (last?.[0]?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from('viaggio_place_ideas')
    .insert({
      journey_id: journeyId,
      google_place_id: googlePlaceId || null,
      name: trimmedName,
      address: address ? String(address).trim() : null,
      lat: latN,
      lng: lngN,
      note: note ? String(note) : '',
      sort_order: nextOrder,
      created_by: userId,
    })
    .select('*')
    .single()
  if (error) throw error
  return mapPlaceIdea(data)
}

export async function updatePlaceIdea(ideaId, patch) {
  const updates = { updated_at: new Date().toISOString() }
  if (patch.note != null) updates.note = String(patch.note)
  if (patch.entryId !== undefined) updates.entry_id = patch.entryId
  if (patch.name != null) updates.name = String(patch.name).trim()
  if (patch.address !== undefined) {
    updates.address = patch.address ? String(patch.address).trim() : null
  }
  if (patch.lat !== undefined) {
    const latN = Number(patch.lat)
    if (Number.isFinite(latN)) updates.lat = latN
  }
  if (patch.lng !== undefined) {
    const lngN = Number(patch.lng)
    if (Number.isFinite(lngN)) updates.lng = lngN
  }

  const { data, error } = await supabase
    .from('viaggio_place_ideas')
    .update(updates)
    .eq('id', ideaId)
    .select('*')
    .single()
  if (error) throw error
  return mapPlaceIdea(data)
}

export async function deletePlaceIdea(ideaId) {
  const { error } = await supabase
    .from('viaggio_place_ideas')
    .delete()
    .eq('id', ideaId)
  if (error) throw error
}

/** Persist shortlist order. `orderedIds` is the full id list for the journey. */
export async function reorderPlaceIdeas(journeyId, orderedIds) {
  const ids = (orderedIds ?? []).filter(Boolean)
  if (!journeyId || ids.length === 0) return
  const results = await Promise.all(
    ids.map((id, sortOrder) =>
      supabase
        .from('viaggio_place_ideas')
        .update({ sort_order: sortOrder, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('journey_id', journeyId),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

export async function listTodos(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_todos')
    .select(
      '*, assignees:viaggio_todo_assignees(journey_person_id, done, done_at)',
    )
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapTodo)
}

export async function addTodo(
  journeyId,
  { title, notes, dueOn, assigneeJourneyPersonIds, done },
  userId,
) {
  const trimmed = String(title || '').trim()
  if (!trimmed) throw new Error('Title required')

  const { data: last } = await supabase
    .from('viaggio_todos')
    .select('sort_order')
    .eq('journey_id', journeyId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = (last?.[0]?.sort_order ?? -1) + 1
  const ids = [...new Set((assigneeJourneyPersonIds ?? []).filter(Boolean))]
  const overallDone = ids.length > 0 ? !!done : !!done

  const { data, error } = await supabase
    .from('viaggio_todos')
    .insert({
      journey_id: journeyId,
      title: trimmed,
      notes: notes != null ? String(notes) : '',
      done: overallDone,
      due_on: dueOn || null,
      sort_order: nextOrder,
      created_by: userId,
    })
    .select('*')
    .single()
  if (error) throw error

  const assignees = await replaceTodoAssignees(data.id, ids, {
    defaultDone: !!done,
  })
  if (ids.length > 0) {
    const rolled = await syncTodoDoneRollup(data.id)
    return mapTodo({ ...(rolled ?? data), assignees })
  }
  return mapTodo({ ...data, assignees })
}

/**
 * Update a todo. When assignees exist, `done` toggles every assignee.
 * Pass `assigneeDone` map/object to set per-person completion.
 */
export async function updateTodo(todoId, patch) {
  const updates = { updated_at: new Date().toISOString() }
  if (patch.title != null) {
    const trimmed = String(patch.title).trim()
    if (!trimmed) throw new Error('Title required')
    updates.title = trimmed
  }
  if (patch.notes != null) updates.notes = String(patch.notes)
  if (patch.dueOn !== undefined) updates.due_on = patch.dueOn || null

  let assignees = await fetchTodoAssignees(todoId)

  if (patch.assigneeJourneyPersonIds !== undefined) {
    assignees = await replaceTodoAssignees(
      todoId,
      patch.assigneeJourneyPersonIds,
      { defaultDone: false },
    )
  }

  if (patch.assigneeDone && typeof patch.assigneeDone === 'object') {
    const entries = Object.entries(patch.assigneeDone)
    for (const [journeyPersonId, done] of entries) {
      const { error } = await supabase
        .from('viaggio_todo_assignees')
        .update({
          done: !!done,
          done_at: done ? new Date().toISOString() : null,
        })
        .eq('todo_id', todoId)
        .eq('journey_person_id', journeyPersonId)
      if (error) throw error
    }
    assignees = await fetchTodoAssignees(todoId)
  }

  if (patch.done != null) {
    if (assignees.length > 0) {
      const { error } = await supabase
        .from('viaggio_todo_assignees')
        .update({
          done: !!patch.done,
          done_at: patch.done ? new Date().toISOString() : null,
        })
        .eq('todo_id', todoId)
      if (error) throw error
      assignees = await fetchTodoAssignees(todoId)
      updates.done = !!patch.done
    } else {
      updates.done = !!patch.done
    }
  } else if (assignees.length > 0) {
    updates.done = assignees.every((a) => a.done)
  }

  const { data, error } = await supabase
    .from('viaggio_todos')
    .update(updates)
    .eq('id', todoId)
    .select('*')
    .single()
  if (error) throw error
  return mapTodo({ ...data, assignees })
}

/** Toggle one assignee's completion; rolls up todo.done. */
export async function updateTodoAssigneeDone(todoId, journeyPersonId, done) {
  if (!todoId || !journeyPersonId) throw new Error('Assignee required')
  const { error } = await supabase
    .from('viaggio_todo_assignees')
    .update({
      done: !!done,
      done_at: done ? new Date().toISOString() : null,
    })
    .eq('todo_id', todoId)
    .eq('journey_person_id', journeyPersonId)
  if (error) throw error
  const rolled = await syncTodoDoneRollup(todoId)
  const assignees = await fetchTodoAssignees(todoId)
  if (!rolled) {
    const { data, error: gErr } = await supabase
      .from('viaggio_todos')
      .select('*')
      .eq('id', todoId)
      .single()
    if (gErr) throw gErr
    return mapTodo({ ...data, assignees })
  }
  return mapTodo({ ...rolled, assignees })
}

export async function deleteTodo(todoId) {
  const { error } = await supabase
    .from('viaggio_todos')
    .delete()
    .eq('id', todoId)
  if (error) throw error
}

/** Persist todo order. `orderedIds` is the full id list for the journey. */
export async function reorderTodos(journeyId, orderedIds) {
  const ids = (orderedIds ?? []).filter(Boolean)
  if (!journeyId || ids.length === 0) return
  const results = await Promise.all(
    ids.map((id, sortOrder) =>
      supabase
        .from('viaggio_todos')
        .update({
          sort_order: sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('journey_id', journeyId),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/**
 * Create a place activity from a shortlist idea and link entry_id.
 * Idempotent when already promoted.
 */
export async function promotePlaceIdea(idea) {
  if (!idea?.id || !idea.journeyId) throw new Error('Place idea required')
  if (idea.entryId) {
    const entry = await getEntry(idea.entryId)
    return { idea, entry }
  }

  const entry = await upsertEntry({
    journeyId: idea.journeyId,
    activityId: 'place',
    title: idea.name || 'Place',
    placeName: idea.name || null,
    address: idea.address || null,
    lat: idea.lat,
    lng: idea.lng,
  })

  const updated = await updatePlaceIdea(idea.id, { entryId: entry.id })
  return { idea: updated, entry }
}

/** Build invite URL for web (or popup opener). */
export function inviteUrl(token) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : ''
  const path =
    typeof window !== 'undefined' ? window.location.pathname : '/'
  return `${origin}${path}?invite=${encodeURIComponent(token)}`
}

function mapArchive(row) {
  if (!row) return null
  return {
    id: row.id,
    ownerId: row.owner_id,
    sourceJourneyId: row.source_journey_id ?? null,
    title: row.title,
    snapshot: row.snapshot,
    snapshotVersion: row.snapshot_version,
    archivedAt: row.archived_at,
    byteSize: row.byte_size ?? null,
  }
}

export async function listJourneyArchives() {
  const { data, error } = await supabase
    .from('viaggio_journey_archives')
    .select(
      'id, owner_id, source_journey_id, title, snapshot_version, archived_at, byte_size',
    )
    .order('archived_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapArchive)
}

export async function getJourneyArchive(archiveId) {
  const { data, error } = await supabase
    .from('viaggio_journey_archives')
    .select('*')
    .eq('id', archiveId)
    .maybeSingle()
  if (error) throw error
  return mapArchive(data)
}

/** Store snapshot JSON then hard-delete the live journey (owner only). */
export async function archiveJourney(journeyId, snapshot) {
  const { data, error } = await supabase.rpc('archive_journey', {
    p_journey_id: journeyId,
    p_snapshot: snapshot,
  })
  if (error) throw error
  return mapArchive(data)
}

export async function deleteJourneyArchive(archiveId) {
  const { error } = await supabase.rpc('delete_journey_archive', {
    p_id: archiveId,
  })
  if (error) throw error
}
