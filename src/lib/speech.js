/**
 * Web Speech API helpers for AI planner dictation + spoken replies.
 * Recognition / synthesis need HTTPS (or localhost) and a user gesture on many browsers.
 *
 * iOS Safari only allows speechSynthesis after a speak() during a user gesture.
 * Call unlockSpeechSynthesis() from the mic tap before async AI replies.
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
let speechUnlocked = false
let voicesPrimed = false

function primeVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    const voices = window.speechSynthesis.getVoices()
    if (voices?.length) voicesPrimed = true
    if (!voicesPrimed) {
      window.speechSynthesis.addEventListener(
        'voiceschanged',
        () => {
          voicesPrimed = true
        },
        { once: true },
      )
      window.speechSynthesis.getVoices()
    }
  } catch {
    /* ignore */
  }
}

function pickVoice(lang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  if (!voices.length) return null
  const tag = String(lang || 'en-US')
  const base = tag.split('-')[0].toLowerCase()
  return (
    voices.find((v) => v.lang === tag) ||
    voices.find((v) => String(v.lang || '').toLowerCase().startsWith(base)) ||
    voices.find((v) => v.default) ||
    voices[0] ||
    null
  )
}

/**
 * Must run inside a click/tap handler (e.g. mic button).
 * Unlocks iOS Safari for later programmatic speak() after async work.
 */
export function unlockSpeechSynthesis() {
  if (!speechSynthesisSupported()) return
  primeVoices()
  try {
    // Resume if Chrome left the synth stuck in paused state.
    window.speechSynthesis.resume?.()
    // Empty/near-empty utterance during the tap unlocks later programmatic speak.
    // Avoid volume=0 — some iOS builds treat that as never starting.
    const unlock = new SpeechSynthesisUtterance(' ')
    unlock.rate = 10
    unlock.volume = 0.01
    unlock.onend = () => {
      speechUnlocked = true
    }
    unlock.onerror = () => {
      speechUnlocked = true
    }
    window.speechSynthesis.speak(unlock)
    speechUnlocked = true
  } catch {
    /* ignore */
  }
}

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

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Speak plain text. Resolves when utterance ends (or immediately if unsupported/empty).
 * @returns {Promise<void>}
 */
export async function speakText(text, { lang } = {}) {
  const t = String(text || '').trim()
  if (!t || !speechSynthesisSupported()) return

  // Mic and synth fight on WebKit — fully stop recognition first.
  stopDictation()
  stopSpeaking()
  // cancel() then immediate speak() is flaky on Chrome/Safari;
  // WebKit also needs a beat to release the mic audio session.
  await wait(250)

  primeVoices()
  if (!speechUnlocked) {
    // Best-effort if caller forgot unlock; often still blocked on iOS.
    try {
      window.speechSynthesis.resume?.()
    } catch {
      /* ignore */
    }
  }

  const utterance = new SpeechSynthesisUtterance(t)
  utterance.lang = lang || 'en-US'
  utterance.volume = 1
  utterance.rate = 1
  const voice = pickVoice(utterance.lang)
  if (voice) utterance.voice = voice

  await new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      if (keepAlive) window.clearInterval(keepAlive)
      resolve()
    }

    utterance.onend = done
    utterance.onerror = done

    // Chrome bug: synthesis can freeze in "paused" after ~15s; nudge resume.
    const keepAlive = window.setInterval(() => {
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      } catch {
        /* ignore */
      }
    }, 5000)

    try {
      window.speechSynthesis.resume?.()
      window.speechSynthesis.speak(utterance)
      // If the browser silently drops the utterance, don't hang the voice loop.
      window.setTimeout(() => {
        if (!settled && !window.speechSynthesis.speaking) done()
      }, 1500)
    } catch {
      done()
    }
  })
}
