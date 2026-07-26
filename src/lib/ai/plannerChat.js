import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { catalogPromptBlock } from '@/lib/ai/catalogContext'
import {
  buildJourneyAiContext,
  journeyContextPromptBlock,
} from '@/lib/ai/journeyContext'
import { mapAiError } from '@/lib/ai/errors'
import { parseModelJson } from '@/lib/ai/parse'
import { normalizeChatTurn } from '@/lib/ai/normalize'
import { CHAT_TURN_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'

/** Soft cap for multimodal inlineData (Firebase request limit ~20 MB). */
export const AI_RECEIPT_MAX_BYTES = 8 * 1024 * 1024

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

function systemInstructionFor(ctx) {
  return [
    'You are Viaggio’s in-app journey planner assistant.',
    'Chat helpfully about this trip. When proposing concrete changes, include structured actions.',
    CHAT_TURN_PROMPT_SCHEMA,
    'Prefer update_* / remove_* with existing ids from context; use add_* for new items.',
    'Full CRUD is allowed on entries, todos, place ideas, playlist, and expenses. update_journey for trip title/dates/timezone/currency. Never delete people/members or the whole journey.',
    'When the user attaches a receipt photo or PDF, read it and propose add_expense.',
    'place_ideas require approximate lat/lng on create. entries need valid activity_id values.',
    'Suggest places: when asked for place ideas / “near the map”, propose add_place_ideas (typically 5–10) near map_focus if present, else near the trip area. Distinct names, lat/lng required, short notes OK. Skip duplicates already in context.',
    'Playlist: when the user asks to search/add songs, emit add_playlist with song or mix titles (and optional search_query). Do NOT invent YouTube/Spotify URLs — the app resolves real youtube.com/watch links via YouTube search. Prefer 3–8 titles. You may still pass a real pasted watch/playlist URL if the user provided one.',
    'Plain YYYY-MM-DD dates and IANA timezones only — never Scope.* mashups.',
    catalogPromptBlock(),
    journeyContextPromptBlock(ctx),
  ].join('\n')
}

function assertReceiptFile(file) {
  if (!file) throw new Error('No file selected')
  const mime = String(file.type || '').toLowerCase()
  if (!AI_RECEIPT_MIME.has(mime)) {
    throw new Error('Receipts must be an image (JPEG, PNG, WebP, GIF) or PDF.')
  }
  if ((file.size ?? 0) > AI_RECEIPT_MAX_BYTES) {
    throw new Error(
      `File is too large for AI (max ${Math.round(AI_RECEIPT_MAX_BYTES / (1024 * 1024))} MB).`,
    )
  }
}

async function fileToInlineDataPart(file) {
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

/**
 * Start a multi-turn planner chat for a journey.
 * @param {string} journeyId
 * @param {{
 *   userId?: string | null,
 *   history?: unknown[],
 *   preferredCurrency?: string | null,
 *   displayLocale?: string | null,
 *   mapFocus?: { lat: number, lng: number, source?: string } | null,
 * }} [opts]
 * Returns { send(message, { files }), refreshContext() }.
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
  const ctx = await buildJourneyAiContext(journeyId, ctxOpts)
  ensureAppCheck()
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, {
    model: FIREBASE_AI_MODEL,
    systemInstruction: systemInstructionFor(ctx),
    generationConfig: {
      responseMimeType: 'application/json',
      // No responseSchema — prompt-carried shape only (avoids Scope.* leaks).
    },
  })
  const chat = model.startChat({
    history: Array.isArray(history) ? history : [],
  })

  async function send(message, { files = [] } = {}) {
    try {
      const text = String(message || '').trim()
      const list = [...(files || [])].filter(Boolean).slice(0, 1)
      list.forEach(assertReceiptFile)

      let payload
      if (list.length) {
        const parts = []
        for (const file of list) {
          parts.push(await fileToInlineDataPart(file))
        }
        parts.push(
          text ||
            'Please read this receipt and propose an add_expense action for this journey.',
        )
        payload = parts
      } else {
        if (!text) throw new Error('Message is empty')
        // Keep map focus on each turn so place suggestions stay near the view.
        if (
          mapFocus &&
          Number.isFinite(Number(mapFocus.lat)) &&
          Number.isFinite(Number(mapFocus.lng))
        ) {
          payload = JSON.stringify({
            user_message: text,
            map_focus: {
              lat: Number(mapFocus.lat),
              lng: Number(mapFocus.lng),
              source: mapFocus.source || 'map',
            },
            note: 'If suggesting places, use add_place_ideas near map_focus; avoid duplicates from context.',
          })
        } else {
          payload = text
        }
      }

      const result = await chat.sendMessage(payload)
      const responseText = result?.response?.text?.() ?? ''
      const parsed = parseModelJson(responseText)
      return normalizeChatTurn(parsed)
    } catch (err) {
      throw new Error(mapAiError(err))
    }
  }

  async function refreshContext() {
    return buildJourneyAiContext(journeyId, ctxOpts)
  }

  return { send, refreshContext, getContext: () => ctx }
}

export { assertReceiptFile, AI_RECEIPT_MIME }
