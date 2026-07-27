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
    'If the user asks for clinical advice, refuse briefly and offer to log or schedule records instead.',
    'Chat helpfully. Concrete edits ALWAYS go in "actions" — the app shows Accept/Reject; nothing is saved until the user Accepts.',
    'Never claim you already updated the vault. Propose actions and briefly tell the user to Accept.',
    'Live patient state is sent each turn as current_patient_context — use that, not outdated memory.',
    CARE_CHAT_TURN_PROMPT_SCHEMA,
    'Prefer update_* / remove_* with existing ids from current_patient_context; use add_* / log_dose for new items.',
    'For medications and doses: only record what the user clearly stated; ask clarifying questions when strength or schedule is missing.',
    'When the user attaches a photo or PDF (med bottle, appointment card, lab printout, BP cuff reading), read visible structured facts and propose matching actions (add_medication, add_appointment, add_reading, add_visit, update_doctor, etc.). Do not invent values that are not readable. Still no diagnosis.',
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
        note: 'Use current_patient_context as the source of truth for ids and existing records.',
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
            note: 'Return valid care chat-turn JSON only (assistant_message + actions). No Scope.* mashups.',
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
        (looksLikeChangeRequest(text) && turn.actions.length === 0) ||
        (list.length > 0 && turn.actions.length === 0)

      if (needActionRepair) {
        const repair = await chat.sendMessage(
          JSON.stringify({
            repair: true,
            errors: turn.warnings?.length
              ? turn.warnings
              : [
                  'User asked for a concrete change (or attached a document) but actions was empty or invalid. Emit non-empty actions so Accept/Reject appears. Do not only describe the fix.',
                ],
            note: 'Re-emit chat-turn JSON with valid actions using ids from current_patient_context. assistant_message should ask the user to Accept.',
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
