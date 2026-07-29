/**
 * Firebase AI responseSchema builders.
 *
 * Prefer prompt-carried shapes in promptSchema.js + generateJsonFromPrompt for
 * journey / chat / enrichment (Gemini 3.6 Scope.* mashups with responseSchema).
 * Only place-ideas still uses getJsonModel(responseSchema).
 */

import { Schema } from 'firebase/ai'

const placeIdeaSchema = Schema.object({
  properties: {
    name: Schema.string(),
    address: Schema.string(),
    lat: Schema.number(),
    lng: Schema.number(),
    note: Schema.string(),
  },
  optionalProperties: ['address', 'note'],
})

export function placeIdeasResponseSchema() {
  return Schema.object({
    properties: {
      place_ideas: Schema.array({ items: placeIdeaSchema }),
      rationale: Schema.string(),
    },
    optionalProperties: ['rationale'],
  })
}
