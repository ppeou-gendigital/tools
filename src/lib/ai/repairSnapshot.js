import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import { generateJsonFromPrompt } from '@/lib/ai/client'
import {
  assertNormalizedSnapshot,
  collectSnapshotIssues,
} from '@/lib/ai/normalize'
import { JOURNEY_SNAPSHOT_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'

/**
 * Ask Gemini to rewrite broken import JSON into a valid snapshot, then normalize.
 * @returns {{ snapshot: object, notes: string[] }}
 */
export async function repairSnapshot(raw, { issues = [], importerName } = {}) {
  const issueList = (issues || []).filter(Boolean)
  const prompt = [
    'You repair broken Viaggio journey snapshot JSON.',
    catalogPromptBlock(),
    JOURNEY_SNAPSHOT_PROMPT_SCHEMA,
    'Fix invalid dates, timezones, activity ids, lodging checkouts, and Scope.* mashups.',
    'Preserve the traveler’s intent and itinerary as much as possible.',
    issueList.length
      ? `Known issues:\n- ${issueList.join('\n- ')}`
      : 'Issues: validation failed; rewrite into a clean snapshot.',
    'Broken JSON:',
    typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2),
  ].join('\n\n')

  const repaired = await generateJsonFromPrompt({
    prompt,
    validate: (parsed) => {
      assertNormalizedSnapshot(parsed, { importerName })
    },
    repairHint: [
      'Emit a complete viaggio.journey_snapshot JSON.',
      'Plain YYYY-MM-DD dates and IANA timezones only.',
      'No Scope.* mashups. Lodging needs ends_at_local (checkout).',
      issueList.length ? `Fix:\n- ${issueList.join('\n- ')}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const snapshot = assertNormalizedSnapshot(repaired, { importerName })
  return {
    snapshot,
    notes: issueList.length
      ? issueList
      : ['AI rewrote the JSON into a valid journey snapshot.'],
  }
}

/**
 * Parse → sanitize → optional AI repair.
 * @returns {{ snapshot: object, repaired: boolean, notes: string[], issues: string[] }}
 */
export async function prepareImportedSnapshot(
  raw,
  { importerName, useAiRepair = true } = {},
) {
  try {
    const snapshot = assertNormalizedSnapshot(raw, { importerName })
    return { snapshot, repaired: false, notes: [], issues: [] }
  } catch (err) {
    const fromThrow = String(err?.message || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const unique = [
      ...new Set([
        ...collectSnapshotIssues(raw, { importerName }),
        ...fromThrow,
      ]),
    ]

    if (!useAiRepair) {
      throw new Error(unique.join('; ') || 'Invalid journey snapshot')
    }

    const { snapshot, notes } = await repairSnapshot(raw, {
      issues: unique,
      importerName,
    })
    return {
      snapshot,
      repaired: true,
      notes: notes.length ? notes : unique,
      issues: unique,
    }
  }
}
