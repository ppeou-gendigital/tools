/**
 * BCP 47 display locales for autocomplete.
 * Curated common tags + Intl.DisplayNames labels when available.
 */

export const COMMON_LOCALES = [
  'en-US',
  'en-GB',
  'en-AU',
  'en-CA',
  'en-NZ',
  'en-SG',
  'es-ES',
  'es-MX',
  'es-AR',
  'fr-FR',
  'fr-CA',
  'de-DE',
  'de-AT',
  'de-CH',
  'it-IT',
  'pt-BR',
  'pt-PT',
  'nl-NL',
  'sv-SE',
  'nb-NO',
  'da-DK',
  'fi-FI',
  'pl-PL',
  'cs-CZ',
  'hu-HU',
  'ro-RO',
  'tr-TR',
  'ru-RU',
  'uk-UA',
  'ar-SA',
  'he-IL',
  'hi-IN',
  'th-TH',
  'vi-VN',
  'id-ID',
  'ms-MY',
  'km-KH',
  'ja-JP',
  'ko-KR',
  'zh-CN',
  'zh-TW',
  'zh-HK',
]

const PREFERRED = [
  'en-US',
  'en-GB',
  'en-AU',
  'es-ES',
  'fr-FR',
  'de-DE',
  'it-IT',
  'pt-BR',
  'ja-JP',
  'ko-KR',
  'zh-CN',
  'th-TH',
  'km-KH',
]

let displayNames = null

function getDisplayNames() {
  if (displayNames !== null) return displayNames
  try {
    displayNames = new Intl.DisplayNames(['en'], { type: 'language' })
  } catch {
    displayNames = undefined
  }
  return displayNames
}

/** Human label for a locale tag, e.g. "English (United States)". */
export function localeLabel(tag) {
  if (!tag) return ''
  try {
    const dn = getDisplayNames()
    if (dn) {
      const name = dn.of(tag)
      if (name && name !== tag) return name
    }
  } catch {
    // fall through
  }
  return tag
}

function normalizeTag(tag) {
  return String(tag || '').trim().replace(/_/g, '-')
}

/** All tags available for search (common list + optional extras). */
export function listLocales(extra) {
  const set = new Set(COMMON_LOCALES)
  if (extra) {
    const t = normalizeTag(extra)
    if (t) set.add(t)
  }
  return [...set]
}

/**
 * Filter locales by tag or display name.
 * Empty query → preferred travel/common locales first.
 */
export function filterLocales(query, limit = 12, extra) {
  const locales = listLocales(extra)
  const q = normalizeTag(query).toLowerCase()

  if (!q) {
    const preferred = PREFERRED.filter((t) => locales.includes(t))
    const rest = locales.filter((t) => !preferred.includes(t))
    return [...preferred, ...rest].slice(0, limit)
  }

  const scored = []
  for (const tag of locales) {
    const lower = tag.toLowerCase()
    const label = localeLabel(tag).toLowerCase()
    let score = 0
    if (lower === q) score = 100
    else if (lower.startsWith(q)) score = 80
    else if (label.startsWith(q)) score = 70
    else if (lower.includes(q)) score = 50
    else if (label.includes(q)) score = 40
    if (score) scored.push({ tag, score })
  }
  scored.sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag))
  return scored.slice(0, limit).map((s) => s.tag)
}

/** True if tag is a plausible BCP 47 locale Intl can use. */
export function isValidLocale(tag) {
  const t = normalizeTag(tag)
  if (!t || !/^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/.test(t)) return false
  try {
    const canonical = Intl.getCanonicalLocales(t)
    return canonical.length > 0
  } catch {
    return false
  }
}
