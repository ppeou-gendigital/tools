import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from 'firebase/ai'
import { FIREBASE_AI_MODEL } from '@/env'
import { ensureAppCheck, getFirebaseApp } from '@/lib/firebaseApp'
import { mapAiError } from '@/lib/ai/errors'
import { parseModelJson } from '@/lib/ai/parse'
import { AiValidationError } from '@/lib/ai/errors'

let aiSingleton = null

function getAiService() {
  ensureAppCheck()
  if (!aiSingleton) {
    aiSingleton = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() })
  }
  return aiSingleton
}

export function getJsonModel(responseSchema) {
  return getGenerativeModel(getAiService(), {
    model: FIREBASE_AI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  })
}

export function getChatModel(systemInstruction) {
  return getGenerativeModel(getAiService(), {
    model: FIREBASE_AI_MODEL,
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
}

/** JSON mime type only — no Firebase responseSchema (avoids Scope.* mashups). */
export function getPromptJsonModel(systemInstruction) {
  return getGenerativeModel(getAiService(), {
    model: FIREBASE_AI_MODEL,
    systemInstruction: systemInstruction || undefined,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
}

async function runValidate(parsed, validate, text) {
  if (typeof validate !== 'function') return
  try {
    validate(parsed)
  } catch (vErr) {
    throw new AiValidationError(vErr.message || 'Validation failed', {
      raw: text,
    })
  }
}

export async function generateJson({
  schema,
  prompt,
  validate,
  repairHint = 'Return valid JSON that matches the required schema only.',
}) {
  const model = getJsonModel(schema)
  try {
    const result = await model.generateContent(String(prompt || ''))
    const text = result?.response?.text?.() ?? ''
    const parsed = parseModelJson(text)
    await runValidate(parsed, validate, text)
    return parsed
  } catch (err) {
    if (!(err instanceof AiValidationError)) {
      throw new Error(mapAiError(err))
    }
    try {
      const repairModel = getJsonModel(schema)
      const repair = await repairModel.generateContent(
        `${repairHint}\n\nPrevious invalid output:\n${err.raw || err.message}`,
      )
      const text = repair?.response?.text?.() ?? ''
      const parsed = parseModelJson(text)
      await runValidate(parsed, validate, text)
      return parsed
    } catch (retryErr) {
      throw new Error(mapAiError(retryErr))
    }
  }
}

export async function generateJsonFromPrompt({
  prompt,
  systemInstruction,
  validate,
  repairHint = 'Return valid JSON only that matches the required shape. No Scope.* mashups in string fields.',
}) {
  const model = getPromptJsonModel(systemInstruction)
  try {
    const result = await model.generateContent(String(prompt || ''))
    const text = result?.response?.text?.() ?? ''
    const parsed = parseModelJson(text)
    await runValidate(parsed, validate, text)
    return parsed
  } catch (err) {
    if (!(err instanceof AiValidationError)) {
      throw new Error(mapAiError(err))
    }
    try {
      const repairModel = getPromptJsonModel(systemInstruction)
      const repair = await repairModel.generateContent(
        `${repairHint}\n\nPrevious invalid output:\n${err.raw || err.message}`,
      )
      const text = repair?.response?.text?.() ?? ''
      const parsed = parseModelJson(text)
      await runValidate(parsed, validate, text)
      return parsed
    } catch (retryErr) {
      throw new Error(mapAiError(retryErr))
    }
  }
}
