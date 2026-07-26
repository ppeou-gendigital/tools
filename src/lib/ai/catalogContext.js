import { ACTIVITIES, PRESETS } from '@/lib/catalog'

/** Compact catalog facts for system prompts (token-light). */
export function catalogPromptBlock() {
  const presets = PRESETS.map(
    (p) => `${p.id} (${p.type}: ${p.label})`,
  ).join('; ')
  const activities = ACTIVITIES.map(
    (a) => `${a.id}/${a.schema}`,
  ).join(', ')
  return [
    'Viaggio catalog constraints:',
    `- journey.preset must be one of: ${presets}`,
    `- entries[].activity_id must be one of: ${activities}`,
    '- entries[].schema must match the activity schema shown after the slash.',
    '- journey.type is "trip" or "journal" and must match the preset type.',
    '- journey.default_currency is ISO 4217 uppercase (e.g. EUR).',
    '- journey.default_timezone is an IANA timezone (e.g. Europe/Lisbon).',
    '- Date fields use YYYY-MM-DD. Instants use ISO-8601 with Z when possible.',
    '- All snapshot ids are opaque local strings for cross-references only.',
    '- Do not invent member emails, invite tokens, or attachment binaries.',
  ].join('\n')
}

export function knownActivityIds() {
  return ACTIVITIES.map((a) => a.id)
}

export function knownPresetIds() {
  return PRESETS.map((p) => p.id)
}

export function schemaForActivity(activityId) {
  const a = ACTIVITIES.find((x) => x.id === activityId)
  return a?.schema || null
}
