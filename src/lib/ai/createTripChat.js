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
    'You are Viaggio’s trip-planning copilot (like ChatGPT / Claude for travel).',
    'Have a natural multi-turn conversation. Help the user explore destinations, dates, vibe, budget, food, and logistics before they commit.',
    'Return JSON only, matching this shape (no markdown):',
    '{',
    '  "assistant_message": string,',
    '  "snapshot": null | viaggio.journey_snapshot',
    '}',
    '',
    'Conversation-first rules:',
    '- Default: reply with a helpful assistant_message and set snapshot to null (questions, lists, comparisons, brainstorming, clarifications).',
    '- Set snapshot to a FULL journey_snapshot only when proposing a new concrete draft or updating the itinerary after the user asks to build/rebuild/revise the plan.',
    '- Prefer revising the current draft in context. Never invent an unrelated destination because of a vague follow-up like “show me the list?” — answer from the draft / conversation.',
    '- assistant_message must match the snapshot when you include one (same trip, dates, place).',
    '- The user commits in the app via “Create journey”; do not assume the trip is booked.',
    '',
    `Today is ${clock.today} (${clock.weekday}) in ${clock.timeZone}.`,
    'Relative phrases (“this weekend”, “Friday”, “next month”) are relative to that today. Prefer future dates unless the user asks for the past.',
    '',
    JOURNEY_SNAPSHOT_PROMPT_SCHEMA,
    'Prefer leisure_trip for vacations, road_trip for driving trips, custom_trip when unclear.',
    '',
    'When emitting a snapshot:',
    '- Put the day-by-day itinerary in entries[] (valid activity_id, title, occurs_on and/or occurs_at, timezone). Typically 6–20 for a weekend trip; never leave entries empty.',
    '- Use exact catalog activity_id values, e.g. drive_leg, meal, restaurant, sightseeing, lodging, hotel, flight, train.',
    '- place_ideas[] are optional extras with lat/lng — they do not replace entries.',
    '- Include useful pre-trip todos. Optional playlist only with embeddable youtube.com watch/playlist or Spotify track/album/playlist URLs — never search URLs or invented IDs; omit playlist if unsure.',
    '- Plain YYYY-MM-DD dates and IANA timezones only.',
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
    'How would you like to shape this trip?'
  const snapshot = tryNormalizeSnapshot(parsed?.snapshot, importerName)
  return { assistantMessage, snapshot }
}

/**
 * Multi-turn create-trip chat. Snapshot only when the draft is proposed/updated.
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
          ? 'Answer from current_draft for lists/details/tweaks. Only replace snapshot when updating the itinerary.'
          : 'No draft yet. Chat first; emit a snapshot when ready to propose a concrete plan.',
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
