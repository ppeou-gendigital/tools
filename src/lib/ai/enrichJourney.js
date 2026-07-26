import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import { generateJsonFromPrompt } from '@/lib/ai/client'
import {
  buildJourneyAiContext,
  journeyContextPromptBlock,
} from '@/lib/ai/journeyContext'
import { normalizeEnrichment } from '@/lib/ai/normalize'
import { ENRICHMENT_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'

export const ENRICH_MODES = [
  {
    id: 'todos',
    label: 'Packing & prep todos',
    hint: 'Add practical pre-trip and on-trip checklist items.',
  },
  {
    id: 'timeline',
    label: 'Fill timeline gaps',
    hint: 'Suggest meals and sightseeing between existing activities.',
  },
  {
    id: 'meals',
    label: 'Meal ideas',
    hint: 'Suggest restaurants/cafes as meal activities and place ideas.',
  },
  {
    id: 'playlist',
    label: 'Trip playlist',
    hint: 'Suggest YouTube/Spotify links that fit the destination vibe.',
  },
  {
    id: 'balanced',
    label: 'Balanced improve',
    hint: 'A light mix of todos, places, and a few timeline fills.',
  },
]

/**
 * @param {object} opts
 * @param {string} opts.journeyId
 * @param {string} [opts.mode]
 * @param {string} [opts.prompt]
 */
export async function enrichJourneyPlan({
  journeyId,
  mode = 'balanced',
  prompt = '',
}) {
  const modeMeta = ENRICH_MODES.find((m) => m.id === mode) || ENRICH_MODES[4]
  const ctx = await buildJourneyAiContext(journeyId)
  const system = [
    'You improve an existing Viaggio journey. Output only additive suggestions.',
    catalogPromptBlock(),
    journeyContextPromptBlock(ctx),
    ENRICHMENT_PROMPT_SCHEMA,
    `Mode: ${modeMeta.id} — ${modeMeta.hint}`,
    'entries need valid activity_id/schema; place_ideas need lat/lng.',
    'Keep suggestions realistic and non-duplicative.',
  ].join('\n')

  const raw = await generateJsonFromPrompt({
    systemInstruction: system,
    prompt: `Extra user notes:\n${prompt || '(none)'}`,
    validate: (parsed) => {
      const n = normalizeEnrichment(parsed)
      const total =
        n.entries.length +
        n.todos.length +
        n.place_ideas.length +
        n.playlist.length
      if (!total) throw new Error('Model returned no usable suggestions')
    },
  })

  return normalizeEnrichment(raw)
}
