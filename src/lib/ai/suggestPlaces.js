import { generateJson } from '@/lib/ai/client'
import {
  buildJourneyAiContext,
  journeySystemRulesPromptBlock,
} from '@/lib/ai/journeyContext'
import { normalizePlaceIdea } from '@/lib/ai/normalize'
import { placeIdeasResponseSchema } from '@/lib/ai/schemas'

/**
 * @param {object} opts
 * @param {string} opts.journeyId
 * @param {string} [opts.prompt]
 * @param {number} [opts.lat]
 * @param {number} [opts.lng]
 * @param {number} [opts.count]
 */
export async function suggestPlacesForJourney({
  journeyId,
  prompt = '',
  lat,
  lng,
  count = 8,
}) {
  const ctx = await buildJourneyAiContext(journeyId)
  const noun = ctx?.journey?.type === 'journal' ? 'journal' : 'trip'
  const system = [
    `You suggest map place ideas for a collaborative ${noun} brainstorm.`,
    'Return distinct places with approximate lat/lng (required) and short notes.',
    'Stay in or near existing pins / map focus.',
    'Do not duplicate places already on the shortlist.',
    journeySystemRulesPromptBlock(ctx),
  ].join('\n')

  const user = {
    hint: prompt || `Suggest interesting places for this ${noun}`,
    near:
      Number.isFinite(lat) && Number.isFinite(lng)
        ? { lat, lng }
        : null,
    count: Math.min(Math.max(Number(count) || 8, 3), 16),
    current_journey_context: ctx,
  }

  const raw = await generateJson({
    schema: placeIdeasResponseSchema(),
    prompt: `${system}\n\nRequest:\n${JSON.stringify(user)}`,
    validate: (parsed) => {
      const ideas = (parsed?.place_ideas || [])
        .map(normalizePlaceIdea)
        .filter(Boolean)
      if (!ideas.length) throw new Error('No valid place ideas with coordinates')
    },
  })

  return {
    placeIdeas: (raw?.place_ideas || [])
      .map(normalizePlaceIdea)
      .filter(Boolean),
    rationale: String(raw?.rationale || '').trim(),
  }
}
