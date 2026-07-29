import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import { mapAiError } from '@/lib/ai/errors'
import {
  assertNormalizedSnapshot,
  collectSnapshotIssues,
} from '@/lib/ai/normalize'
import { parseModelJson } from '@/lib/ai/parse'
import {
  assertReceiptFile,
  fileToInlineDataPart,
  MAX_AI_CHAT_FILES,
} from '@/lib/ai/plannerChat'
import { planningClockContext } from '@/lib/ai/planningClock'
import { JOURNEY_SNAPSHOT_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'

export { planningClockContext } from '@/lib/ai/planningClock'

function systemInstructionFor({
  preferredCurrency,
  displayLocale,
  plannerDisplayName,
}) {
  const prefCurrency = String(preferredCurrency || '')
    .trim()
    .toUpperCase()
  const prefLocale = String(displayLocale || '').trim()
  const plannerName =
    String(plannerDisplayName || '').trim() || 'Traveler'
  const clock = planningClockContext(prefLocale)

  return [
    'You are Viaggio’s planning copilot for trips AND journals (life logs / household).',
    'Have a natural multi-turn conversation. Clarify whether they want a trip itinerary or an ongoing journal before locking a draft.',
    'Return JSON only, matching this shape (no markdown):',
    '{',
    '  "assistant_message": string,',
    '  "snapshot": null | viaggio.journey_snapshot',
    '}',
    '',
    'Conversation-first rules:',
    '- Default: reply with a helpful assistant_message and set snapshot to null (questions, lists, comparisons, brainstorming, clarifications).',
    '- Set snapshot to a FULL journey_snapshot only when proposing a new concrete draft or updating the plan after the user asks to build/rebuild/revise.',
    '- Prefer revising the current draft in context. Never invent an unrelated destination because of a vague follow-up like “show me the list?” — answer from the draft / conversation.',
    '- assistant_message must match the snapshot when you include one (same place, dates, intent).',
    '- The user commits in the app via “Create journey”; do not assume it is saved yet.',
    '',
    `Today is ${clock.today} (${clock.weekday}) in ${clock.timeZone}.`,
    'Relative phrases (“this weekend”, “Friday”, “next month”) are relative to that today. Prefer future dates unless the user asks for the past.',
    '',
    `The signed-in planner’s display name is "${plannerName}" (also sent each turn as planner_display_name).`,
    '',
    'When the user attaches photo(s) or PDF(s) (confirmation emails, tickets, boarding passes, hotel bookings, screenshots):',
    '- Read visible facts (places, dates, times, confirmation codes, passenger/guest names). Do not invent unread values.',
    '- Extract distinct traveler/passenger/guest names exactly as written on the documents.',
    '- If one or more passenger/guest names are visible: list them in assistant_message and ask which of those people is the planner (hint with planner_display_name), or none (booking for others / not listed). Prefer snapshot: null on that turn until they answer, unless they already answered in the same message.',
    '- Never assume a fuzzy name match to planner_display_name without asking.',
    '- After they confirm a match to passenger P: people[] owner is the planner (use planner_display_name); do not also add a duplicate seat for P; other booking names become guest travelers; set participant_ids on flights/hotels for everyone on that booking.',
    '- After they say none: people[] owner is still the planner; include all booking names as guest travelers.',
    '- If no passenger/guest names are visible, skip the identity question; owner-only people is fine.',
    '',
    JOURNEY_SNAPSHOT_PROMPT_SCHEMA,
    '',
    'Preset guidance:',
    '- Trips: leisure_trip (vacations / flights & stays), road_trip (driving), custom_trip when unclear, family_reunion / league_season when fitting.',
    '- Journals: life_log, household, car_log, home_project, custom_journal — sparse timelines OK; prefer bills/chores/milestones/appointments over flights/hotels.',
    '- journey.type must match the preset type (trip vs journal).',
    '',
    'When emitting a snapshot:',
    '- Put the timeline in entries[] (valid activity_id, title, occurs_on and/or occurs_at_local, timezone). Trips typically 6–20 entries; journals may be fewer. Never leave entries empty when proposing a concrete draft.',
    '- Prefer occurs_at_local / ends_at_local + IANA timezone(s). App converts to UTC. Never encode local clock as …Z.',
    '- Set journey.default_timezone to the main destination IANA zone (e.g. America/Los_Angeles for Las Vegas). Copy that timezone onto every single-location entry — never leave entries as UTC when the trip has a city timezone.',
    '- Transit/rental: start_timezone = origin city zone, end_timezone = destination city zone (not UTC).',
    '- Lodging: check-in occurs_at_local, check-out ends_at_local on the same entry; checkout before return transit on the last day. Never a separate “Hotel Check-out” activity.',
    '- Use exact catalog activity_id values.',
    '- people[] must list the planner (owner) plus any confirmed guest travelers from bookings or the conversation. Mention travelers in assistant_message when listing them.',
    '- place_ideas[] are optional extras with lat/lng — they do not replace entries.',
    '- Include useful todos. Optional playlist as song titles (search_query OK) — never invent YouTube/Spotify URLs; the app resolves watch links.',
    catalogPromptBlock(),
    'User preferences (JSON):',
    JSON.stringify(
      {
        preferred_currency: /^[A-Z]{3}$/.test(prefCurrency)
          ? prefCurrency
          : null,
        display_locale: prefLocale || null,
        planner_display_name: plannerName,
      },
      null,
      2,
    ),
    'When discussing money, lead with preferred_currency when set. When emitting a snapshot, use preferred_currency as journey.default_currency if the user did not specify another.',
  ].join('\n')
}

function tryNormalizeSnapshot(raw, importerName) {
  if (!raw || typeof raw !== 'object') return null
  try {
    return assertNormalizedSnapshot(raw, { importerName })
  } catch {
    return null
  }
}

function parseTurn(responseText, importerName) {
  const parsed = parseModelJson(responseText)
  const assistantMessage =
    String(parsed?.assistant_message || parsed?.message || '').trim() ||
    'How would you like to shape this plan?'
  const rawSnap = parsed?.snapshot
  const snapshot = tryNormalizeSnapshot(rawSnap, importerName)
  const issues =
    rawSnap && typeof rawSnap === 'object' && !snapshot
      ? collectSnapshotIssues(rawSnap, { importerName })
      : []
  return { assistantMessage, snapshot, rawSnap, issues }
}

/**
 * Multi-turn create chat (trip or journal). Snapshot only when the draft is proposed/updated.
 * Returns { send(message, { files }) }.
 */
export async function createTripChat({
  history = [],
  preferredCurrency = null,
  displayLocale = null,
  getDraft = () => null,
  importerName = 'Traveler',
} = {}) {
  ensureAppCheck()
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() })
  const plannerDisplayName =
    String(importerName || '').trim() || 'Traveler'
  const model = getGenerativeModel(ai, {
    model: FIREBASE_AI_MODEL,
    systemInstruction: systemInstructionFor({
      preferredCurrency,
      displayLocale,
      plannerDisplayName,
    }),
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  const chat = model.startChat({
    history: Array.isArray(history) ? history : [],
  })

  async function send(message, { files = [] } = {}) {
    try {
      const text = String(message || '').trim()
      const list = [...(files || [])].filter(Boolean).slice(0, MAX_AI_CHAT_FILES)
      list.forEach(assertReceiptFile)

      const draft = typeof getDraft === 'function' ? getDraft() : null
      const envelope = {
        user_message:
          text ||
          (list.length
            ? list.length === 1
              ? 'Please read this attachment and use any trip/journal details you can see. If passenger/guest names are visible, list them and ask which one is me (or none).'
              : `Please read these ${list.length} attachments and use any trip/journal details you can see. If passenger/guest names are visible, list them and ask which one is me (or none).`
            : ''),
        planner_display_name: plannerDisplayName,
        current_draft: draft || null,
        note: draft
          ? 'Answer from current_draft for lists/details/tweaks. Only replace snapshot when updating the plan. Prefer occurs_at_local/ends_at_local + timezones. If traveler identity is still unconfirmed after booking attachments, ask before emitting a create-ready snapshot.'
          : 'No draft yet. Chat first; if bookings show passenger names, confirm which is the planner before emitting a create-ready snapshot.',
      }

      if (!envelope.user_message && !list.length) {
        throw new Error('Message is empty')
      }

      let payload
      if (list.length) {
        const parts = []
        for (const file of list) {
          parts.push(await fileToInlineDataPart(file))
        }
        parts.push(JSON.stringify(envelope))
        payload = parts
      } else {
        payload = JSON.stringify(envelope)
      }

      const result = await chat.sendMessage(payload)
      let { assistantMessage, snapshot, rawSnap, issues } = parseTurn(
        result?.response?.text?.() ?? '',
        importerName,
      )

      // Snapshot proposed but invalid → one repair turn with field-path issues.
      if (rawSnap && typeof rawSnap === 'object' && !snapshot && issues.length) {
        const repair = await chat.sendMessage(
          JSON.stringify({
            repair: true,
            errors: issues,
            note: 'Return JSON with assistant_message + a valid viaggio.journey_snapshot in snapshot. Fix the listed issues. No Scope.* mashups. Lodging needs ends_at_local.',
            previous_invalid_snapshot: rawSnap,
          }),
        )
        ;({ assistantMessage, snapshot } = parseTurn(
          repair?.response?.text?.() ?? '',
          importerName,
        ))
      }

      return { assistant_message: assistantMessage, snapshot }
    } catch (err) {
      throw new Error(mapAiError(err))
    }
  }

  return { send }
}
