import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import { generateJsonFromPrompt } from '@/lib/ai/client'
import { planningClockContext } from '@/lib/ai/planningClock'
import { normalizeJourneySnapshot } from '@/lib/ai/normalize'
import { JOURNEY_SNAPSHOT_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'

/**
 * @param {object} input
 * @param {string} input.prompt
 * @param {string} [input.destination]
 * @param {string} [input.startsOn]
 * @param {string} [input.endsOn]
 * @param {string} [input.timezone]
 * @param {string} [input.currency]
 * @param {string} [input.preset]
 * @param {number} [input.travelers]
 * @param {string} [input.vibe]
 * @param {string} [input.importerName]
 */
export async function generateJourneyPlan(input) {
  const clock = planningClockContext()
  const system = [
    'You are Viaggio’s trip planner.',
    'Generate a portable journey snapshot JSON for import into Viaggio.',
    catalogPromptBlock(),
    JOURNEY_SNAPSHOT_PROMPT_SCHEMA,
    'Prefer leisure_trip for vacations, road_trip for driving trips, custom_trip when unclear.',
    'Include a realistic day-by-day mix of transit, lodging, meals, sightseeing in entries[] (non-empty).',
    'Include 4–10 place_ideas with approximate lat/lng near the destination.',
    'Include useful pre-trip todos (visa, packs, bookings).',
    'Playlist URLs must be https YouTube / YouTube Music / Spotify search URLs only — never invent playlist or track deep IDs.',
    'If the user supplied starts_on, ends_on, timezone, or currency, use those exact values.',
    `Today is ${clock.today} (${clock.weekday}) in ${clock.timeZone}. Relative phrases are relative to that today; prefer future dates unless the user asks for the past.`,
  ].join('\n')

  const userPayload = {
    prompt: input.prompt,
    destination: input.destination || null,
    starts_on: input.startsOn || null,
    ends_on: input.endsOn || null,
    preferred_timezone: input.timezone || null,
    preferred_currency: input.currency || null,
    preferred_preset: input.preset || null,
    travelers: input.travelers || 1,
    vibe: input.vibe || null,
  }

  const overrides = {}
  if (input.startsOn) overrides.startsOn = input.startsOn
  if (input.endsOn) overrides.endsOn = input.endsOn
  if (input.timezone) overrides.defaultTimezone = input.timezone
  if (input.currency) overrides.defaultCurrency = input.currency
  if (input.preset) overrides.preset = input.preset

  const raw = await generateJsonFromPrompt({
    systemInstruction: system,
    prompt: `User request:\n${JSON.stringify(userPayload, null, 2)}`,
    validate: (parsed) => {
      normalizeJourneySnapshot(parsed, {
        importerName: input.importerName,
        overrides,
      })
    },
  })

  return {
    snapshot: normalizeJourneySnapshot(raw, {
      importerName: input.importerName,
      overrides,
    }),
    summary: String(raw?.summary || '').trim(),
  }
}
