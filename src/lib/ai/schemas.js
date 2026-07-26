import { Schema } from 'firebase/ai'
import { knownActivityIds, knownPresetIds } from '@/lib/ai/catalogContext'

const activityEnum = () => Schema.enumString({ enum: knownActivityIds() })
const presetEnum = () => Schema.enumString({ enum: knownPresetIds() })

const personSchema = Schema.object({
  properties: {
    id: Schema.string(),
    display_name: Schema.string(),
    email: Schema.string(),
    phone_e164: Schema.string(),
    member_role: Schema.enumString({
      enum: ['owner', 'editor', 'viewer'],
    }),
  },
  optionalProperties: ['email', 'phone_e164', 'member_role'],
})

const entrySchema = Schema.object({
  properties: {
    id: Schema.string(),
    activity_id: activityEnum(),
    schema: Schema.string(),
    title: Schema.string(),
    occurs_on: Schema.string(),
    occurs_at: Schema.string(),
    ends_at: Schema.string(),
    timezone: Schema.string(),
    start_timezone: Schema.string(),
    end_timezone: Schema.string(),
    place_name: Schema.string(),
    address: Schema.string(),
    lat: Schema.number(),
    lng: Schema.number(),
    details: Schema.string(),
  },
  optionalProperties: [
    'occurs_on',
    'occurs_at',
    'ends_at',
    'timezone',
    'start_timezone',
    'end_timezone',
    'place_name',
    'address',
    'lat',
    'lng',
    'details',
  ],
})

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

const todoSchema = Schema.object({
  properties: {
    title: Schema.string(),
    notes: Schema.string(),
    due_on: Schema.string(),
    done: Schema.boolean(),
  },
  optionalProperties: ['notes', 'due_on', 'done'],
})

const playlistSchema = Schema.object({
  properties: {
    title: Schema.string(),
    url: Schema.string(),
    platform: Schema.enumString({ enum: ['spotify', 'youtube'] }),
  },
  optionalProperties: ['platform'],
})

/** Full journey snapshot for generate-journey. */
export function journeySnapshotSchema() {
  return Schema.object({
    properties: {
      format: Schema.enumString({ enum: ['viaggio.journey_snapshot'] }),
      version: Schema.integer(),
      journey: Schema.object({
        properties: {
          title: Schema.string(),
          type: Schema.enumString({ enum: ['trip', 'journal'] }),
          preset: presetEnum(),
          default_timezone: Schema.string(),
          default_currency: Schema.string(),
          starts_on: Schema.string(),
          ends_on: Schema.string(),
        },
        optionalProperties: ['starts_on', 'ends_on'],
      }),
      people: Schema.array({ items: personSchema }),
      entries: Schema.array({ items: entrySchema }),
      place_ideas: Schema.array({ items: placeIdeaSchema }),
      todos: Schema.array({ items: todoSchema }),
      playlist: Schema.array({ items: playlistSchema }),
      summary: Schema.string(),
    },
    optionalProperties: [
      'entries',
      'place_ideas',
      'todos',
      'playlist',
      'summary',
    ],
  })
}

export function placeIdeasResponseSchema() {
  return Schema.object({
    properties: {
      place_ideas: Schema.array({ items: placeIdeaSchema }),
      rationale: Schema.string(),
    },
    optionalProperties: ['rationale'],
  })
}

export function enrichmentSchema() {
  return Schema.object({
    properties: {
      notes: Schema.string(),
      entries: Schema.array({ items: entrySchema }),
      todos: Schema.array({ items: todoSchema }),
      place_ideas: Schema.array({ items: placeIdeaSchema }),
      playlist: Schema.array({ items: playlistSchema }),
    },
    optionalProperties: [
      'notes',
      'entries',
      'todos',
      'place_ideas',
      'playlist',
    ],
  })
}

export function chatTurnSchema() {
  return Schema.object({
    properties: {
      assistant_message: Schema.string(),
      actions: Schema.array({
        items: Schema.object({
          properties: {
            type: Schema.enumString({
              enum: [
                'add_entries',
                'update_entries',
                'remove_entries',
                'add_todos',
                'update_todos',
                'remove_todos',
                'add_place_ideas',
                'update_place_ideas',
                'remove_place_ideas',
                'add_playlist',
                'update_playlist',
                'remove_playlist',
                'add_expense',
                'update_expense',
                'remove_expenses',
                'update_journey',
              ],
            }),
            label: Schema.string(),
            ids: Schema.array({ items: Schema.string() }),
            entries: Schema.array({ items: entrySchema }),
            todos: Schema.array({ items: todoSchema }),
            place_ideas: Schema.array({ items: placeIdeaSchema }),
            playlist: Schema.array({ items: playlistSchema }),
          },
          optionalProperties: [
            'label',
            'ids',
            'entries',
            'todos',
            'place_ideas',
            'playlist',
          ],
        }),
      }),
    },
    optionalProperties: ['actions'],
  })
}
