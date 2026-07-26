/**
 * Web Speech API helpers for AI planner dictation + spoken replies.
 * Recognition / synthesis need HTTPS (or localhost) and a user gesture on many browsers.
 */

function recognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function speechRecognitionSupported() {
  return Boolean(recognitionCtor())
}

export function speechSynthesisSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis?.speak === 'function'
  )
}

/** Map app locale tags (e.g. en, en-US) to a BCP-47 tag speech APIs accept. */
export function speechLangFromLocale(locale) {
  const tag = String(locale || '').trim()
  if (!tag) return 'en-US'
  if (tag.includes('-')) return tag
  const map = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-BR',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
  }
  return map[tag.toLowerCase()] || `${tag}-${tag.toUpperCase()}`
}

let activeRecognition = null

export function stopDictation() {
  const rec = activeRecognition
  activeRecognition = null
  if (!rec) return
  try {
    rec.onresult = null
    rec.onerror = null
    rec.onend = null
    rec.abort?.()
  } catch {
    try {
      rec.stop()
    } catch {
      /* ignore */
    }
  }
}

/**
 * Start one-shot or continuous dictation.
 * @returns {SpeechRecognition | null}
 */
export function startDictation({
  lang = 'en-US',
  continuous = false,
  onInterim,
  onFinal,
  onError,
  onEnd,
} = {}) {
  const Ctor = recognitionCtor()
  if (!Ctor) {
    onError?.(new Error('Speech recognition is not supported in this browser.'))
    return null
  }
  stopDictation()
  const rec = new Ctor()
  rec.lang = lang || 'en-US'
  rec.interimResults = true
  rec.continuous = Boolean(continuous)
  rec.maxAlternatives = 1

  rec.onresult = (event) => {
    let interim = ''
    let finalText = ''
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const piece = event.results[i]?.[0]?.transcript || ''
      if (event.results[i].isFinal) finalText += piece
      else interim += piece
    }
    if (interim) onInterim?.(interim)
    const trimmed = finalText.trim()
    if (trimmed) onFinal?.(trimmed)
  }

  rec.onerror = (event) => {
    const code = event?.error || 'failed'
    // User / silence soft-fails — don't surface as hard errors.
    if (code === 'aborted' || code === 'no-speech') return
    onError?.(
      new Error(
        code === 'not-allowed'
          ? 'Microphone permission denied.'
          : `Speech recognition error: ${code}`,
      ),
    )
  }

  rec.onend = () => {
    if (activeRecognition === rec) activeRecognition = null
    onEnd?.()
  }

  activeRecognition = rec
  try {
    rec.start()
  } catch (err) {
    activeRecognition = null
    onError?.(err instanceof Error ? err : new Error('Could not start microphone.'))
    return null
  }
  return rec
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
}

/**
 * Speak plain text. Resolves when utterance ends (or immediately if unsupported/empty).
 * @returns {Promise<void>}
 */
export function speakText(text, { lang } = {}) {
  return new Promise((resolve) => {
    const t = String(text || '').trim()
    if (!t || !speechSynthesisSupported()) {
      resolve()
      return
    }
    stopSpeaking()
    const utterance = new SpeechSynthesisUtterance(t)
    if (lang) utterance.lang = lang
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    try {
      window.speechSynthesis.speak(utterance)
    } catch {
      resolve()
    }
  })
}
