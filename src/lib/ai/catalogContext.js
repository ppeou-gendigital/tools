import { ACTIVITIES, PRESETS } from '@/lib/catalog'

/** Compact catalog facts for system prompts (token-light). */
export function catalogPromptBlock() {
  const presets = PRESETS.map(
    (p) =>
      `${p.id} (${p.type}: ${p.label}; activities: ${(p.primaryActivities || []).slice(0, 8).join('/')})`,
  ).join('; ')
  const activities = ACTIVITIES.map((a) => `${a.id}/${a.schema}`).join(', ')
  return [
    'Viaggio catalog constraints:',
    `- journey.preset must be one of: ${presets}`,
    `- entries[].activity_id must be one of: ${activities}`,
    '- entries[].schema must match the activity schema shown after the slash.',
    '- journey.type is "trip" or "journal" and must match the preset type.',
    '- Dual-zone schemas: transit (flight, train, ferry, boat, drive_leg, rideshare, …) and rental — require start_timezone + end_timezone with local wall times.',
    '- Lodging schema: check-in/out on one entry via occurs_at_local / ends_at_local — never a separate checkout activity.',
    '- journey.default_currency is ISO 4217 uppercase (e.g. EUR).',
    '- journey.default_timezone is an IANA timezone (e.g. Europe/Lisbon).',
    '- Date fields use YYYY-MM-DD. Prefer wall locals (YYYY-MM-DDTHH:mm) + timezone(s); app stores real UTC.',
    '- All snapshot ids are opaque local strings for cross-references only.',
    '- Do not invent member emails, invite tokens, or attachment binaries.',
    '- Parallel activities: multiple entries may share the same time with different participant_ids.',
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
