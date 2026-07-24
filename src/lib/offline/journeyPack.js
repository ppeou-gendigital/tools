/**
 * Build / refresh a Viaggio journey offline pack (JSON for the offline path).
 * Uses live API shapes pages already understand — not the portable import snapshot.
 */

import { fetchRatesToPreferred } from '@/lib/fxRates'
import {
  getJourney,
  listEntries,
  listEntryParticipants,
  listExpensesForJourney,
  listJourneyPeople,
  listMembers,
  listPlaceIdeas,
  listPlaylist,
  listSplits,
  listTodos,
  myMembership,
} from '@/lib/viaggioApi'
import { putPack, getPack, deletePack, listPacks } from '@/lib/offline/packStore'

export const JOURNEY_PACK_KIND = 'journey'
export const JOURNEY_PACK_SCHEMA = 1
export const TOOL_ID = 'viaggio'

/**
 * @param {string} journeyId
 * @param {{ userId?: string | null }} [opts]
 */
export async function buildJourneyOfflinePack(journeyId, opts = {}) {
  const userId = opts.userId ?? null

  const [
    journey,
    membership,
    people,
    members,
    entries,
    expenses,
    participants,
    playlist,
    placeIdeas,
    todos,
  ] = await Promise.all([
    getJourney(journeyId),
    userId ? myMembership(journeyId, userId) : Promise.resolve(null),
    listJourneyPeople(journeyId),
    listMembers(journeyId),
    listEntries(journeyId),
    listExpensesForJourney(journeyId),
    listEntryParticipants(journeyId),
    listPlaylist(journeyId),
    listPlaceIdeas(journeyId),
    listTodos(journeyId),
  ])

  if (!journey) throw new Error('Journey not found')

  const splitsByExpenseId = {}
  await Promise.all(
    expenses.map(async (ex) => {
      try {
        splitsByExpenseId[ex.id] = await listSplits(ex.id)
      } catch {
        splitsByExpenseId[ex.id] = []
      }
    }),
  )

  const currencies = [
    journey.defaultCurrency,
    ...expenses.map((e) => e.currency),
  ]
  let fx = null
  try {
    fx = await fetchRatesToPreferred(journey.defaultCurrency, currencies)
  } catch (err) {
    console.warn('[viaggio] offline pack FX prefetch failed:', err?.message ?? err)
  }

  /** @type {import('./packStore').OfflinePack} */
  const pack = {
    schemaVersion: JOURNEY_PACK_SCHEMA,
    toolId: TOOL_ID,
    scopeId: journeyId,
    kind: JOURNEY_PACK_KIND,
    title: journey.title || 'Journey',
    syncedAt: new Date().toISOString(),
    journey,
    membership,
    people,
    members,
    entries,
    expenses,
    splitsByExpenseId,
    entryParticipants: participants,
    playlist,
    placeIdeas,
    todos,
    fx,
  }

  await putPack(pack)
  return pack
}

export async function getJourneyOfflinePack(journeyId) {
  const pack = await getPack(journeyId)
  if (!pack || pack.kind !== JOURNEY_PACK_KIND) return null
  return pack
}

export async function removeJourneyOfflinePack(journeyId) {
  await deletePack(journeyId)
}

export async function listJourneyOfflinePacks() {
  const all = await listPacks()
  return all.filter((p) => p.kind === JOURNEY_PACK_KIND)
}

/** Convert pack amount using frozen FX; falls back to raw currency formatting upstream. */
export function convertCentsWithPackFx(pack, amountCents, fromCurrency) {
  const from = String(fromCurrency || '').toUpperCase()
  const preferred = String(pack?.fx?.preferred || pack?.journey?.defaultCurrency || '').toUpperCase()
  const cents = Number(amountCents) || 0
  if (!preferred || from === preferred) return { cents, currency: preferred || from }
  const mult = pack?.fx?.toPreferred?.[from]
  if (mult == null || !Number.isFinite(mult)) {
    return { cents, currency: from }
  }
  return { cents: Math.round(cents * mult), currency: preferred }
}
