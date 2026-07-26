import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import { mapAiError } from '@/lib/ai/errors'
import { normalizeJourneySnapshot } from '@/lib/ai/normalize'
import { parseModelJson } from '@/lib/ai/parse'
import { planningClockContext } from '@/lib/ai/planningClock'
import { JOURNEY_SNAPSHOT_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'

export { planningClockContext } from '@/lib/ai/planningClock'

function systemInstructionFor({ preferredCurrency, displayLocale }) {
  const prefCurrency = String(preferredCurrency || '')
    .trim()
    .toUpperCase()
  const prefLocale = String(displayLocale || '').trim()
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
    return normalizeJourneySnapshot(raw, { importerName })
  } catch {
    return null
  }
}

function parseTurn(responseText, importerName) {
  const parsed = parseModelJson(responseText)
  const assistantMessage =
    String(parsed?.assistant_message || parsed?.message || '').trim() ||
    'How would you like to shape this plan?'
  const snapshot = tryNormalizeSnapshot(parsed?.snapshot, importerName)
  return { assistantMessage, snapshot }
}

/**
 * Multi-turn create chat (trip or journal). Snapshot only when the draft is proposed/updated.
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
  const model = getGenerativeModel(ai, {
    model: FIREBASE_AI_MODEL,
    systemInstruction: systemInstructionFor({
      preferredCurrency,
      displayLocale,
    }),
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  const chat = model.startChat({
    history: Array.isArray(history) ? history : [],
  })

  async function send(message) {
    try {
      const text = String(message || '').trim()
      if (!text) throw new Error('Message is empty')

      const draft = typeof getDraft === 'function' ? getDraft() : null
      const payload = {
        user_message: text,
        current_draft: draft || null,
        note: draft
          ? 'Answer from current_draft for lists/details/tweaks. Only replace snapshot when updating the plan. Prefer occurs_at_local/ends_at_local + timezones.'
          : 'No draft yet. Chat first; emit a snapshot when ready to propose a concrete trip or journal plan.',
      }

      const result = await chat.sendMessage(JSON.stringify(payload))
      const { assistantMessage, snapshot } = parseTurn(
        result?.response?.text?.() ?? '',
        importerName,
      )

      return { assistant_message: assistantMessage, snapshot }
    } catch (err) {
      throw new Error(mapAiError(err))
    }
  }

  return { send }
}
