import { asyncStorage } from '@/lib/storage'

const VERSION = 1
const MAX_MODEL_TURNS = 40
const MAX_MESSAGES = 80

export function sessionKey({ userId, patientId }) {
  if (!userId || !patientId) return null
  return `docto:ai-session:chat:${userId}:${patientId}`
}

function stripMessagesForStorage(messages) {
  return (Array.isArray(messages) ? messages : [])
    .slice(-MAX_MESSAGES)
    .map((m) => {
      if (!m || typeof m !== 'object') return null
      return { ...m }
    })
    .filter(Boolean)
}

function trimModelHistory(history) {
  const list = Array.isArray(history) ? history : []
  if (list.length <= MAX_MODEL_TURNS) return list
  return list.slice(-MAX_MODEL_TURNS)
}

export function appendModelTurn(history, userText, assistantText) {
  const next = Array.isArray(history) ? [...history] : []
  const u = String(userText || '').trim()
  const a = String(assistantText || '').trim()
  if (u) {
    next.push({ role: 'user', parts: [{ text: u }] })
  }
  if (a) {
    next.push({ role: 'model', parts: [{ text: a }] })
  }
  return trimModelHistory(next)
}

/**
 * @returns {Promise<null | {
 *   messages: object[],
 *   input: string,
 *   modelHistory: object[],
 *   updatedAt: string,
 * }>}
 */
export async function loadSession(key) {
  if (!key) return null
  try {
    const raw = await asyncStorage.getItem(key)
    if (!raw) return null
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!parsed || parsed.version !== VERSION) return null
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      input: typeof parsed.input === 'string' ? parsed.input : '',
      modelHistory: trimModelHistory(parsed.modelHistory),
      updatedAt: parsed.updatedAt || null,
    }
  } catch {
    return null
  }
}

export async function saveSession(key, payload) {
  if (!key) return
  try {
    const body = {
      version: VERSION,
      messages: stripMessagesForStorage(payload?.messages),
      input: typeof payload?.input === 'string' ? payload.input : '',
      modelHistory: trimModelHistory(payload?.modelHistory),
      updatedAt: new Date().toISOString(),
    }
    await asyncStorage.setItem(key, JSON.stringify(body))
  } catch {
    // ignore quota / private mode
  }
}

export async function clearSession(key) {
  if (!key) return
  try {
    await asyncStorage.removeItem(key)
  } catch {
    // ignore
  }
}
