/**
 * Portable journey snapshot (import / export / archive).
 *
 * Wire format: docs/journey-snapshot.md
 * Sample: src/samples/journey-snapshot.sample.json
 */

import {
  addJourneyPerson,
  addPlaceIdea,
  addPlaylistItem,
  createJourney,
  listEntries,
  listEntryParticipants,
  listExpensesForJourney,
  listJourneyPeople,
  listMembers,
  listPlaceIdeas,
  listPlaylist,
  updateJourneyPerson,
  updatePlaceIdea,
  upsertEntry,
  upsertExpenseWithSplits,
} from '@/lib/viaggioApi'
import { supabase } from '@/lib/supabase'

export const JOURNEY_SNAPSHOT_FORMAT = 'viaggio.journey_snapshot'
export const JOURNEY_SNAPSHOT_VERSION = 1

/** @typedef {import('@/lib/viaggioApi')} */

export function validateJourneySnapshot(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Snapshot must be a JSON object')
  }
  if (raw.format !== JOURNEY_SNAPSHOT_FORMAT) {
    throw new Error(
      `Unsupported format (expected "${JOURNEY_SNAPSHOT_FORMAT}")`,
    )
  }
  const version = Number(raw.version)
  if (!Number.isInteger(version) || version < 1 || version > JOURNEY_SNAPSHOT_VERSION) {
    throw new Error(`Unsupported snapshot version: ${raw.version}`)
  }
  if (!raw.journey || typeof raw.journey !== 'object') {
    throw new Error('Snapshot missing journey')
  }
  const j = raw.journey
  if (!String(j.title || '').trim()) throw new Error('journey.title is required')
  if (j.type !== 'trip' && j.type !== 'journal') {
    throw new Error('journey.type must be "trip" or "journal"')
  }
  if (!String(j.preset || '').trim()) throw new Error('journey.preset is required')
  if (!String(j.default_timezone || '').trim()) {
    throw new Error('journey.default_timezone is required')
  }
  if (!/^[A-Z]{3}$/.test(String(j.default_currency || ''))) {
    throw new Error('journey.default_currency must be ISO 4217 (e.g. EUR)')
  }
  if (!Array.isArray(raw.people)) throw new Error('people must be an array')
  for (const key of [
    'contacts',
    'entries',
    'entry_participants',
    'expenses',
    'expense_splits',
    'playlist',
    'place_ideas',
  ]) {
    if (raw[key] != null && !Array.isArray(raw[key])) {
      throw new Error(`${key} must be an array`)
    }
  }
  return raw
}

async function listContacts(journeyId) {
  const { data, error } = await supabase
    .from('viaggio_contacts')
    .select('*')
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

async function listSplitsForExpenses(expenseIds) {
  if (!expenseIds.length) return []
  const { data, error } = await supabase
    .from('viaggio_expense_splits')
    .select('*')
    .in('expense_id', expenseIds)
  if (error) throw error
  return data ?? []
}

/**
 * Build a portable snapshot from a live journey (export / archive payload).
 */
export async function buildJourneySnapshot(journeyId) {
  const { data: journeyRow, error: jErr } = await supabase
    .from('viaggio_journeys')
    .select('*')
    .eq('id', journeyId)
    .maybeSingle()
  if (jErr) throw jErr
  if (!journeyRow) throw new Error('Journey not found')

  const [
    people,
    members,
    contacts,
    entries,
    participants,
    expenses,
    playlist,
    placeIdeas,
  ] = await Promise.all([
    listJourneyPeople(journeyId),
    listMembers(journeyId),
    listContacts(journeyId),
    listEntries(journeyId),
    listEntryParticipants(journeyId),
    listExpensesForJourney(journeyId),
    listPlaylist(journeyId),
    listPlaceIdeas(journeyId),
  ])

  const roleByUser = new Map(members.map((m) => [m.userId, m.role]))
  const splits = await listSplitsForExpenses(expenses.map((e) => e.id))

  return {
    format: JOURNEY_SNAPSHOT_FORMAT,
    version: JOURNEY_SNAPSHOT_VERSION,
    exported_at: new Date().toISOString(),
    journey: {
      title: journeyRow.title,
      type: journeyRow.type,
      preset: journeyRow.preset,
      activity_packs: journeyRow.activity_packs ?? [],
      default_timezone: journeyRow.default_timezone,
      default_currency: journeyRow.default_currency,
      starts_on: journeyRow.starts_on,
      ends_on: journeyRow.ends_on,
    },
    people: people.map((p) => ({
      id: p.id,
      display_name: p.displayName,
      email: p.email,
      phone_e164: p.phoneE164,
      member_role: p.linkedUserId
        ? roleByUser.get(p.linkedUserId) ?? null
        : null,
    })),
    contacts: contacts.map((c) => ({
      id: c.id,
      kind: c.kind,
      display_name: c.display_name,
      phone_e164: c.phone_e164,
      email: c.email,
      notes: c.notes,
    })),
    entries: entries.map((e) => ({
      id: e.id,
      activity_id: e.activityId,
      schema: e.schema,
      title: e.title,
      body: e.body ?? {},
      occurs_on: e.occursOn,
      occurs_at: e.occursAt,
      ends_at: e.endsAt,
      timezone: e.timezone,
      start_timezone: e.startTimezone,
      end_timezone: e.endTimezone,
      place_name: e.placeName,
      address: e.address,
      lat: e.lat,
      lng: e.lng,
      phone_e164: e.phoneE164,
      contact_id: e.contactId,
      details: e.details ?? {},
    })),
    entry_participants: participants.map((p) => ({
      entry_id: p.entryId,
      person_id: p.journeyPersonId,
    })),
    expenses: expenses.map((e) => ({
      id: e.id,
      entry_id: e.entryId,
      title: e.title,
      amount_cents: e.amountCents,
      currency: e.currency,
      paid_by_person_id: e.paidBy,
      split_mode: e.splitMode,
      category: e.category,
    })),
    expense_splits: splits.map((s) => ({
      expense_id: s.expense_id,
      person_id: s.journey_person_id,
      amount_cents: Number(s.amount_cents) || 0,
    })),
    playlist: playlist.map((p) => ({
      url: p.url,
      title: p.title,
      platform: p.platform,
      sort_order: p.sortOrder,
    })),
    place_ideas: placeIdeas.map((p) => ({
      google_place_id: p.googlePlaceId,
      name: p.name,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      note: p.note,
      sort_order: p.sortOrder,
      entry_id: p.entryId,
    })),
  }
}

function newIdMap() {
  return new Map()
}

function mapId(map, oldId) {
  if (oldId == null) return null
  return map.get(oldId) ?? null
}

/**
 * Import a snapshot as a new journey. Caller becomes owner.
 * Returns { journey, idMaps }.
 */
export async function importJourneySnapshot(raw, { user } = {}) {
  const snap = validateJourneySnapshot(raw)
  const j = snap.journey

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  const uid = user?.id || authUser?.id
  if (!uid) throw new Error('Sign in required to import')

  const journey = await createJourney({
    title: j.title,
    type: j.type,
    preset: j.preset,
    defaultTimezone: j.default_timezone,
    defaultCurrency: j.default_currency,
    startsOn: j.starts_on ?? null,
    endsOn: j.ends_on ?? null,
    activityPacks: Array.isArray(j.activity_packs) ? j.activity_packs : [],
  })

  const personMap = newIdMap()
  const contactMap = newIdMap()
  const entryMap = newIdMap()
  const expenseMap = newIdMap()

  const existingPeople = await listJourneyPeople(journey.id)
  const selfSeat =
    existingPeople.find((p) => p.linkedUserId === uid) ||
    existingPeople[0]

  const people = Array.isArray(snap.people) ? snap.people : []
  const importerEmail = user?.email || authUser?.email
  const ownerCandidate =
    people.find((p) => p.member_role === 'owner') ||
    people.find(
      (p) =>
        importerEmail &&
        p.email &&
        String(p.email).toLowerCase() === String(importerEmail).toLowerCase(),
    ) ||
    people[0]

  for (const p of people) {
    if (ownerCandidate && p.id === ownerCandidate.id && selfSeat) {
      personMap.set(p.id, selfSeat.id)
      // Refresh display name / email on self seat when useful
      if (p.display_name || p.email || p.phone_e164) {
        await updateJourneyPerson({
          id: selfSeat.id,
          displayName: p.display_name || selfSeat.displayName,
          email: p.email ?? selfSeat.email,
          phoneE164: p.phone_e164 ?? selfSeat.phoneE164,
        })
      }
      continue
    }
    const created = await addJourneyPerson({
      journeyId: journey.id,
      displayName: p.display_name || 'Traveler',
      email: p.email ?? null,
      phoneE164: p.phone_e164 ?? null,
    })
    personMap.set(p.id, created.id)
  }

  // Contacts (optional)
  const e164 = /^\+[1-9]\d{1,14}$/
  for (const c of snap.contacts ?? []) {
    const phone = c.phone_e164 && e164.test(c.phone_e164) ? c.phone_e164 : null
    const kind = ['person', 'place', 'business'].includes(c.kind)
      ? c.kind
      : 'person'
    const { data, error } = await supabase
      .from('viaggio_contacts')
      .insert({
        journey_id: journey.id,
        kind,
        display_name: c.display_name || 'Contact',
        phone_e164: phone,
        email: c.email ?? null,
        notes: c.notes ?? null,
        created_by: uid,
      })
      .select('*')
      .single()
    if (error) throw error
    contactMap.set(c.id, data.id)
  }

  const participantsByEntry = new Map()
  for (const row of snap.entry_participants ?? []) {
    const list = participantsByEntry.get(row.entry_id) || []
    const mapped = mapId(personMap, row.person_id)
    if (mapped) list.push(mapped)
    participantsByEntry.set(row.entry_id, list)
  }

  for (const e of snap.entries ?? []) {
    const created = await upsertEntry({
      journeyId: journey.id,
      activityId: e.activity_id,
      schema: e.schema,
      title: e.title ?? '',
      body: e.body ?? {},
      occursOn: e.occurs_on ?? null,
      occursAt: e.occurs_at ?? null,
      endsAt: e.ends_at ?? null,
      timezone: e.timezone ?? null,
      startTimezone: e.start_timezone ?? null,
      endTimezone: e.end_timezone ?? null,
      placeName: e.place_name ?? null,
      address: e.address ?? null,
      lat: e.lat ?? null,
      lng: e.lng ?? null,
      phoneE164: e.phone_e164 ?? null,
      contactId: mapId(contactMap, e.contact_id),
      details: e.details ?? {},
      participantIds: participantsByEntry.get(e.id) ?? [],
    })
    entryMap.set(e.id, created.id)
  }

  const splitsByExpense = new Map()
  for (const s of snap.expense_splits ?? []) {
    const list = splitsByExpense.get(s.expense_id) || []
    const personId = mapId(personMap, s.person_id)
    if (personId) {
      list.push({
        journeyPersonId: personId,
        amountCents: Number(s.amount_cents) || 0,
      })
    }
    splitsByExpense.set(s.expense_id, list)
  }

  for (const x of snap.expenses ?? []) {
    const entryId = mapId(entryMap, x.entry_id)
    const paidBy = mapId(personMap, x.paid_by_person_id)
    if (!entryId || !paidBy) continue
    let splits = splitsByExpense.get(x.id) || []
    const amount = Number(x.amount_cents) || 0
    const sum = splits.reduce((a, s) => a + s.amountCents, 0)
    if (splits.length === 0 || sum !== amount) {
      // Fall back to payer-only if splits missing / inconsistent
      splits = [{ journeyPersonId: paidBy, amountCents: amount }]
    }
    const created = await upsertExpenseWithSplits({
      entryId,
      title: x.title ?? '',
      amountCents: amount,
      currency: x.currency,
      paidBy,
      splitMode: x.split_mode === 'custom' ? 'custom' : 'equal',
      category: x.category ?? null,
      splits,
    })
    expenseMap.set(x.id, created.id)
  }

  const playlist = [...(snap.playlist ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
  for (const item of playlist) {
    if (!item.url) continue
    await addPlaylistItem(
      journey.id,
      {
        url: item.url,
        title: item.title ?? '',
        platform: item.platform ?? undefined,
      },
      uid,
    )
  }

  const placeIdeas = [...(snap.place_ideas ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
  for (const item of placeIdeas) {
    if (!item?.name) continue
    const lat = Number(item.lat)
    const lng = Number(item.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    const created = await addPlaceIdea(
      journey.id,
      {
        googlePlaceId: item.google_place_id ?? null,
        name: item.name,
        address: item.address ?? null,
        lat,
        lng,
        note: item.note ?? '',
      },
      uid,
    )
    const mappedEntryId = mapId(entryMap, item.entry_id)
    if (mappedEntryId && created.entryId !== mappedEntryId) {
      await updatePlaceIdea(created.id, { entryId: mappedEntryId })
    }
  }

  return {
    journey,
    idMaps: {
      people: Object.fromEntries(personMap),
      contacts: Object.fromEntries(contactMap),
      entries: Object.fromEntries(entryMap),
      expenses: Object.fromEntries(expenseMap),
    },
  }
}

export function snapshotFilename(snapshot) {
  const title = String(snapshot?.journey?.title || 'journey')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  const day = (snapshot?.exported_at || new Date().toISOString()).slice(0, 10)
  return `viaggio-${title || 'journey'}-${day}.json`
}

export function downloadSnapshotJson(snapshot, filename) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || snapshotFilename(snapshot)
  a.click()
  URL.revokeObjectURL(url)
}

export async function readSnapshotFile(file) {
  const text = await file.text()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('File is not valid JSON')
  }
  return validateJourneySnapshot(parsed)
}
