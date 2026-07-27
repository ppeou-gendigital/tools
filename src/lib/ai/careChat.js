import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { applyCareActionGuardrails } from '@/lib/ai/careGuardrails'
import { AiValidationError, mapAiError } from '@/lib/ai/errors'
import { normalizeChatTurn } from '@/lib/ai/normalize'
import { parseModelJson } from '@/lib/ai/parse'
import {
  buildPatientAiContext,
  patientSystemRulesPromptBlock,
} from '@/lib/ai/patientContext'
import { CARE_CHAT_TURN_PROMPT_SCHEMA } from '@/lib/ai/promptSchema'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'
import {
  placesSearchConfigured,
  runSearchDoctorsTool,
} from '@/lib/placesDoctorSearch'

/** Soft cap for multimodal inlineData (Firebase request limit ~20 MB). */
export const AI_ATTACH_MAX_BYTES = 8 * 1024 * 1024

export const AI_ATTACH_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
])

const MAX_TOOL_ROUNDS = 2

function looksLikeChangeRequest(text) {
  return /\b(log|add|remove|delete|update|change|schedule|reschedule|set|record|track|cancel|refill)\b/i.test(
    String(text || ''),
  )
}

function systemInstructionFor(ctx) {
  return [
    'You are Docto’s in-app personal health organizer assistant.',
    'You help the patient organize their own care records (doctors, appointments, visits, medications, doses, readings).',
    'You are NOT a doctor or clinician. Do not diagnose, prescribe, or give medical treatment advice.',
    'If the user asks for clinical advice, refuse briefly and offer to log or schedule records instead (type chat or ask_user).',
    'Always return one CareTurn JSON object with a type discriminator (chat | ask_user | propose_actions | need_tool).',
    'Concrete vault edits go in propose_actions.actions — the app shows Accept/Reject; nothing is saved until Accept.',
    'Never claim you already updated the vault.',
    'Live patient state is sent each turn as current_patient_context — use that, not outdated memory.',
    'To find doctors/clinics in the real world, return type need_tool with tool.name=search_doctors and a clear textQuery (name and/or city/ZIP). Never invent phone numbers or addresses.',
    'If the user wants a doctor search but has not given enough location or name, use ask_user.',
    'When tool_result for search_doctors is provided, return propose_actions with add_doctor actions from those results only.',
    CARE_CHAT_TURN_PROMPT_SCHEMA,
    'Prefer update_* / remove_* with existing ids from current_patient_context; use add_* / log_dose for new items.',
    'For medications and doses: only record what the user clearly stated; ask_user when strength or schedule is missing.',
    'When the user attaches a photo or PDF (med bottle, appointment card, lab printout, BP cuff reading), read visible structured facts and propose matching actions. Do not invent unread values. Still no diagnosis.',
    'Plain YYYY-MM-DD dates and ISO-8601 datetimes only — never Scope.* mashups.',
    patientSystemRulesPromptBlock(ctx),
  ].join('\n')
}

export function assertAttachFile(file) {
  if (!file) throw new Error('No file selected')
  const mime = String(file.type || '').toLowerCase()
  if (!AI_ATTACH_MIME.has(mime)) {
    throw new Error('Attachments must be an image (JPEG, PNG, WebP, GIF) or PDF.')
  }
  if ((file.size ?? 0) > AI_ATTACH_MAX_BYTES) {
    throw new Error(
      `File is too large for AI (max ${Math.round(AI_ATTACH_MAX_BYTES / (1024 * 1024))} MB).`,
    )
  }
}

async function fileToInlineDataPart(file) {
  assertAttachFile(file)
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
  let turn = normalizeChatTurn(parsed)
  const medicationIds = new Set(
    (ctx?.medications || []).map((m) => m.id).filter(Boolean),
  )
  turn = applyCareActionGuardrails(turn, { medicationIds })
  return turn
}

async function parseTurnFromChat(chat, responseText) {
  try {
    return parseModelJson(responseText)
  } catch (err) {
    if (!(err instanceof AiValidationError)) throw err
    const repair = await chat.sendMessage(
      JSON.stringify({
        repair: true,
        errors: [err.message],
        note: 'Return valid CareTurn JSON only (type + assistant_message + optional actions/tool). No Scope.* mashups.',
        previous_invalid_output: String(err.raw || responseText).slice(0, 6000),
      }),
    )
    return parseModelJson(repair?.response?.text?.() ?? '')
  }
}

async function executeNeedTool(turn) {
  const name = turn?.tool?.name
  const args = turn?.tool?.args || {}
  if (name !== 'search_doctors') {
    return {
      name: name || 'unknown',
      ok: false,
      error: `Unsupported tool: ${name || '(missing)'}`,
    }
  }
  if (!placesSearchConfigured()) {
    return {
      name: 'search_doctors',
      ok: false,
      error:
        'Places is not configured. Ask the user for name/phone/address to add manually.',
    }
  }
  try {
    const found = await runSearchDoctorsTool({
      textQuery: args.textQuery,
      maxResults: args.maxResults ?? 5,
    })
    return {
      name: 'search_doctors',
      ok: true,
      query: args.textQuery,
      doctors: found.doctors || [],
      count: (found.doctors || []).length,
    }
  } catch (err) {
    return {
      name: 'search_doctors',
      ok: false,
      error: err?.message || String(err),
    }
  }
}

/**
 * Start a multi-turn care chat for the unlocked patient.
 * Returns { send(message, { files }), refreshContext(), getContext() }.
 */
export async function createCareChat({
  patientId,
  key,
  patient = null,
  history = [],
  displayLocale = null,
} = {}) {
  const ctxOpts = { patientId, key, patient, displayLocale }
  let ctx = await buildPatientAiContext(ctxOpts)
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
      ctx = await buildPatientAiContext(ctxOpts)
      const text = String(message || '').trim()
      const list = [...(files || [])].filter(Boolean).slice(0, 1)
      list.forEach(assertAttachFile)

      const envelope = {
        user_message:
          text ||
          (list.length
            ? 'Please read this attachment and propose care-record actions I can Accept (medication, appointment, reading, visit, or doctor/office details). Do not diagnose.'
            : ''),
        current_patient_context: ctx,
        note: 'Return a CareTurn with type chat | ask_user | propose_actions | need_tool. Use need_tool/search_doctors for live clinic lookup.',
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

      let result = await chat.sendMessage(payload)
      let parsed = await parseTurnFromChat(chat, result?.response?.text?.() ?? '')
      let turn = finalizeTurn(parsed, ctx)

      // Tool loop: need_tool → Places → model proposes actions
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        if (turn.type !== 'need_tool' || !turn.tool?.name) break
        const toolResult = await executeNeedTool(turn)
        result = await chat.sendMessage(
          JSON.stringify({
            tool_result: toolResult,
            note: toolResult.ok
              ? 'Return type propose_actions with add_doctor actions from tool_result.doctors (include offices/phone). If empty, ask_user or chat.'
              : 'Tool failed. Use ask_user or chat; offer manual add_doctor if the user has details.',
            current_patient_context: {
              patient: ctx.patient,
              doctors: ctx.doctors,
              clock: ctx.clock,
            },
          }),
        )
        parsed = await parseTurnFromChat(chat, result?.response?.text?.() ?? '')
        turn = finalizeTurn(parsed, ctx)
      }

      // If model still stuck on need_tool, surface a friendly ask
      if (turn.type === 'need_tool') {
        turn = {
          ...turn,
          type: 'ask_user',
          assistant_message:
            turn.assistant_message ||
            'I still need a doctor name and/or city/ZIP to search. What should I look up?',
          tool: null,
          actions: [],
        }
      }

      const needActionRepair =
        (Array.isArray(parsed?.actions) &&
          parsed.actions.length > 0 &&
          turn.actions.length === 0) ||
        (looksLikeChangeRequest(text) &&
          turn.type === 'propose_actions' &&
          turn.actions.length === 0) ||
        (list.length > 0 && turn.actions.length === 0)

      if (needActionRepair) {
        const repair = await chat.sendMessage(
          JSON.stringify({
            repair: true,
            errors: turn.warnings?.length
              ? turn.warnings
              : [
                  'User asked for a concrete change (or attached a document) but actions was empty or invalid. Emit type propose_actions with non-empty actions.',
                ],
            note: 'Re-emit CareTurn JSON with valid actions using ids from current_patient_context.',
            user_message: text,
            current_patient_context: {
              patient: ctx.patient,
              doctors: ctx.doctors,
              appointments: ctx.appointments,
              visits: ctx.visits,
              medications: ctx.medications,
              readings: ctx.readings,
              clock: ctx.clock,
            },
          }),
        )
        turn = finalizeTurn(
          parseModelJson(repair?.response?.text?.() ?? ''),
          ctx,
        )
        if (
          (looksLikeChangeRequest(text) || list.length > 0) &&
          turn.actions.length === 0
        ) {
          turn = {
            ...turn,
            warnings: [
              ...(turn.warnings || []),
              'No Acceptable changes were returned. Ask again with more detail.',
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
    ctx = await buildPatientAiContext(ctxOpts)
    return ctx
  }

  return { send, refreshContext, getContext: () => ctx }
}

export { AI_ATTACH_MIME as AI_RECEIPT_MIME, assertAttachFile as assertReceiptFile }
