import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { applyChatActionGuardrails } from '@/lib/ai/actionGuardrails'
import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import {
  buildJourneyAiContext,
  journeySystemRulesPromptBlock,
} from '@/lib/ai/journeyContext'
import { AiValidationError, mapAiError } from '@/lib/ai/errors'
import { parseModelJson } from '@/lib/ai/parse'
import { normalizeChatTurn } from '@/lib/ai/normalize'
import { CHAT_TURN_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'

/** Soft cap for multimodal inlineData (Firebase request limit ~20 MB). */
export const AI_RECEIPT_MAX_BYTES = 8 * 1024 * 1024

/** Max image/PDF parts per chat turn (create + planner). */
export const MAX_AI_CHAT_FILES = 8

const AI_RECEIPT_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
])

function looksLikeChangeRequest(text) {
  return /\b(fix|update|change|move|add|remove|delete|set|reorder|correct|adjust|put|schedule|checkout|reschedule|swap)\b/i.test(
    String(text || ''),
  )
}

function systemInstructionFor(ctx) {
  const noun = ctx?.journey?.type === 'journal' ? 'journal' : 'trip'
  return [
    `You are Viaggio’s in-app ${noun} planner assistant.`,
    'Chat helpfully. Concrete edits ALWAYS go in "actions" — the app shows Accept/Reject; nothing is saved until the user Accepts.',
    'Never claim you already updated the journey. Propose actions and briefly tell the user to Accept.',
    'Live journey state is sent each turn as current_journey_context — use that, not outdated memory.',
    CHAT_TURN_PROMPT_SCHEMA,
    'Prefer update_* / remove_* with existing ids from current_journey_context; use add_* for new items.',
    'Full CRUD is allowed on entries, todos, place ideas, playlist, and expenses. update_journey for title/dates/timezone/currency. Never delete people/members or the whole journey.',
    'When the user attaches receipt photo(s) or PDF(s), read them and propose add_expense (one action per receipt when amounts differ).',
    'place_ideas require approximate lat/lng on create. entries need valid activity_id values.',
    'Suggest places: when asked for place ideas / “near the map”, propose add_place_ideas (typically 5–10) near map_focus if present, else near existing pins. Distinct names, lat/lng required, short notes OK. Skip duplicates.',
    'Playlist: when the user asks to search/add songs, emit add_playlist with song or mix titles (and optional search_query). Do NOT invent YouTube/Spotify URLs — the app resolves real youtube.com/watch links via YouTube search. Prefer 3–8 titles. You may still pass a real pasted watch/playlist URL if the user provided one.',
    'Plain YYYY-MM-DD dates and IANA timezones only — never Scope.* mashups.',
    catalogPromptBlock(),
    journeySystemRulesPromptBlock(ctx),
  ].join('\n')
}

export function assertReceiptFile(file) {
  if (!file) throw new Error('No file selected')
  const mime = String(file.type || '').toLowerCase()
  if (!AI_RECEIPT_MIME.has(mime)) {
    throw new Error(
      'Attachments must be an image (JPEG, PNG, WebP, GIF) or PDF.',
    )
  }
  if ((file.size ?? 0) > AI_RECEIPT_MAX_BYTES) {
    throw new Error(
      `File is too large for AI (max ${Math.round(AI_RECEIPT_MAX_BYTES / (1024 * 1024))} MB).`,
    )
  }
}

export async function fileToInlineDataPart(file) {
  assertReceiptFile(file)
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
  const base64 = String(dataUrl).split(',')[1]
  if (!base64) throw new Error('Could not encode file')
  const mimeType =
    String(file.type || '').toLowerCase() === 'image/jpg'
      ? 'image/jpeg'
      : String(file.type || 'application/octet-stream')
  return { inlineData: { data: base64, mimeType } }
}

function finalizeTurn(parsed, ctx) {
  const defaultTimezone = ctx?.journey?.default_timezone || 'UTC'
  let turn = normalizeChatTurn(parsed, { defaultTimezone })
  turn = applyChatActionGuardrails(turn, {
    contextEntries: ctx?.entries || [],
  })
  return turn
}

/**
 * Start a multi-turn planner chat for a journey.
 * Returns { send(message, { files }), refreshContext(), getContext() }.
 */
export async function createPlannerChat(
  journeyId,
  {
    userId = null,
    history = [],
    preferredCurrency = null,
    displayLocale = null,
    mapFocus = null,
  } = {},
) {
  const ctxOpts = { userId, preferredCurrency, displayLocale, mapFocus }
  let ctx = await buildJourneyAiContext(journeyId, ctxOpts)
  ensureAppCheck()
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, {
    model: FIREBASE_AI_MODEL,
    systemInstruction: systemInstructionFor(ctx),
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  const chat = model.startChat({
    history: Array.isArray(history) ? history : [],
  })

  async function send(message, { files = [] } = {}) {
    try {
      ctx = await buildJourneyAiContext(journeyId, ctxOpts)
      const text = String(message || '').trim()
      const list = [...(files || [])].filter(Boolean).slice(0, MAX_AI_CHAT_FILES)
      list.forEach(assertReceiptFile)

      const envelope = {
        user_message:
          text ||
          (list.length
            ? list.length === 1
              ? 'Please read this receipt and propose an add_expense action for this journey.'
              : `Please read these ${list.length} receipts and propose add_expense action(s) for this journey.`
            : ''),
        current_journey_context: ctx,
        note: 'Use current_journey_context as the source of truth for ids, times (wall locals + zones), and participants. Prefer occurs_at_local/ends_at_local when editing times.',
      }
      if (
        mapFocus &&
        Number.isFinite(Number(mapFocus.lat)) &&
        Number.isFinite(Number(mapFocus.lng))
      ) {
        envelope.map_focus = {
          lat: Number(mapFocus.lat),
          lng: Number(mapFocus.lng),
          source: mapFocus.source || 'map',
        }
        envelope.note +=
          ' If suggesting places, use add_place_ideas near map_focus; avoid duplicates.'
      }

      if (!envelope.user_message && !list.length) {
        throw new Error('Message is empty')
      }

      let payload
      if (list.length) {
        const parts = []
        for (const file of list) {
          parts.push(await fileToInlineDataPart(file))
        }
        parts.push(JSON.stringify(envelope))
        payload = parts
      } else {
        payload = JSON.stringify(envelope)
      }

      const result = await chat.sendMessage(payload)
      const responseText = result?.response?.text?.() ?? ''
      let parsed
      try {
        parsed = parseModelJson(responseText)
      } catch (err) {
        if (!(err instanceof AiValidationError)) throw err
        const repair = await chat.sendMessage(
          JSON.stringify({
            repair: true,
            errors: [err.message],
            note: 'Return valid chat-turn JSON only (assistant_message + actions). No Scope.* mashups. Prefer occurs_at_local/ends_at_local + timezones.',
            previous_invalid_output: String(err.raw || responseText).slice(
              0,
              6000,
            ),
          }),
        )
        parsed = parseModelJson(repair?.response?.text?.() ?? '')
      }

      let turn = finalizeTurn(parsed, ctx)
      const needActionRepair =
        (Array.isArray(parsed?.actions) &&
          parsed.actions.length > 0 &&
          turn.actions.length === 0) ||
        (looksLikeChangeRequest(text) && turn.actions.length === 0)

      if (needActionRepair) {
        const repair = await chat.sendMessage(
          JSON.stringify({
            repair: true,
            errors: turn.warnings?.length
              ? turn.warnings
              : [
                  'User asked for a concrete change but actions was empty or invalid. Emit non-empty actions so Accept/Reject appears. Do not only describe the fix.',
                ],
            note: 'Re-emit chat-turn JSON with valid actions using ids from current_journey_context. Prefer occurs_at_local/ends_at_local. assistant_message should ask the user to Accept.',
            user_message: text,
            current_journey_context: {
              people: ctx.people,
              entries: ctx.entries,
              days: ctx.days,
              journey: ctx.journey,
            },
          }),
        )
        turn = finalizeTurn(
          parseModelJson(repair?.response?.text?.() ?? ''),
          ctx,
        )
        if (looksLikeChangeRequest(text) && turn.actions.length === 0) {
          turn = {
            ...turn,
            warnings: [
              ...(turn.warnings || []),
              'No Acceptable changes were returned. Ask again, or say “propose an update_entries action I can Accept.”',
            ],
          }
        }
      }
      return turn
    } catch (err) {
      throw new Error(mapAiError(err))
    }
  }

  async function refreshContext() {
    ctx = await buildJourneyAiContext(journeyId, ctxOpts)
    return ctx
  }

  return { send, refreshContext, getContext: () => ctx }
}

export { AI_RECEIPT_MIME }
