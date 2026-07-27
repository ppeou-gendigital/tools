import { AiValidationError } from '@/lib/ai/errors'

/** Extract JSON object/array from model text (handles fenced blocks). */
export function parseModelJson(text) {
  const raw = String(text || '').trim()
  if (!raw) throw new AiValidationError('Empty model response')

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : raw).trim()

  try {
    return JSON.parse(candidate)
  } catch {
    const start = candidate.search(/[{[]/)
    if (start < 0) {
      throw new AiValidationError('Model response was not JSON', { raw })
    }
    const sliced = candidate.slice(start)
    try {
      return JSON.parse(sliced)
    } catch {
      throw new AiValidationError('Could not parse model JSON', { raw })
    }
  }
}
