/**
 * Find doctors / clinics via Google Places API (New) Text Search.
 * Uses VITE_GOOGLE_MAPS_API_KEY (same key as office autocomplete).
 */

import { GOOGLE_MAPS_API_KEY } from '@/env'
import { parsePlaceAddress, placeDisplayName, placeToOffice } from '@/lib/placeAddress'

const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.location',
  'places.addressComponents',
  'places.primaryType',
  'places.primaryTypeDisplayName',
  'places.types',
].join(',')

const FIND_VERB =
  /\b(find|search|look\s*up|locate|recommend|suggest|nearby|near\s+me)\b/i
const CARE_NOUN =
  /\b(doctor|doctors|physician|physicians|pcp|primary\s*care|clinic|clinics|dentist|dermatologist|cardiologist|pediatrician|ob\/?gyn|gyn(ecologist)?|orthopedist|provider|providers)\b/i
const FOLLOW_UP_FIND =
  /\b(did you find|find (him|her|them|it)|any (results|luck)|show (me )?(more )?detail|more (info|detail|information)|who (is|are) (he|she|they))\b/i
const LOCATION_ONLY =
  /\b((he|she|they|the doctor)\s+)?(is\s+)?(in|near|around)\s+/i

const SPECIALTY_PATTERNS = [
  { re: /\b(primary\s*care|primary\s*doctor|pcp|family\s*medicine|family\s*doctor|internist)\b/i, specialty: 'Primary care', query: 'primary care doctor', type: 'doctor' },
  { re: /\bdentist|dental\b/i, specialty: 'Dentist', query: 'dentist', type: 'dentist' },
  { re: /\bdermatolog/i, specialty: 'Dermatology', query: 'dermatologist', type: 'doctor' },
  { re: /\bcardiolog/i, specialty: 'Cardiology', query: 'cardiologist', type: 'doctor' },
  { re: /\bpediatric/i, specialty: 'Pediatrics', query: 'pediatrician', type: 'doctor' },
  { re: /\bob\/?gyn|gynecolog|obstetric/i, specialty: 'OB/GYN', query: 'OB GYN doctor', type: 'doctor' },
  { re: /\borthoped/i, specialty: 'Orthopedics', query: 'orthopedic doctor', type: 'doctor' },
]

const STOP_NAME = new Set([
  'in',
  'near',
  'around',
  'the',
  'a',
  'an',
  'dr',
  'doctor',
  'doctors',
  'find',
  'search',
  'please',
  'help',
  'me',
  'my',
  'primary',
  'care',
  'houston',
  'katy',
  'texas',
  'tx',
])

function extractZip(text) {
  return text.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1] || null
}

function extractWhere(text) {
  const zip = extractZip(text)
  if (zip) return zip

  const withState = text.match(
    /\b(?:in|near|around)\s+([A-Za-z][A-Za-z .'-]{1,40}?),\s*([A-Z]{2})\b/i,
  )
  if (withState) {
    return `${withState[1].trim()}, ${withState[2].toUpperCase()}`
  }

  // "Houston TX" / "in Houston TX" — city words only (no "Dr … in …")
  const cityState = text.match(
    /\b(?:in|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s*,?\s*(TX|CA|NY|FL|WA|IL|PA|OH|GA|NC|MI|NJ|VA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|UT|IA|NV|AR|MS|KS|NM|NE|ID|WV|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)\b/,
  )
  if (cityState) {
    return `${cityState[1].trim()}, ${cityState[2].toUpperCase()}`
  }

  const bareCityState = text.match(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s*,?\s*(TX|CA|NY|FL|WA|IL|PA|OH|GA|NC|MI|NJ|VA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|UT|IA|NV|AR|MS|KS|NM|NE|ID|WV|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)\b/,
  )
  if (bareCityState && !/\bDr\.?\b/i.test(bareCityState[1])) {
    return `${bareCityState[1].trim()}, ${bareCityState[2].toUpperCase()}`
  }

  const near = text.match(
    /\b(?:in|near|around)\s+([A-Za-z][A-Za-z0-9 .,'-]{1,60})/i,
  )
  if (near) {
    let w = near[1].replace(/[?.!,]+$/, '').trim()
    // Drop leading "Dr. Name" if captured
    w = w.replace(/^Dr\.?\s+[A-Za-z'’-]+(?:\s+[A-Za-z'’-]+){0,3}\s+/i, '').trim()
    return w || null
  }

  return null
}

function extractDoctorName(text) {
  const dr = text.match(
    /\bDr\.?\s+([A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){0,3})\b/,
  )
  if (dr?.[1]) return cleanName(dr[1])

  // "find/search … Name Name … in/near"
  const findNamed = text.match(
    /\b(?:find|search|look\s*up|locate)\s+(?:(?:a|my|the)\s+)?(?:doctor\s+)?(?:named\s+|called\s+)?([A-Z][a-zA-Z'’-]+(?:\s+[A-Z][a-zA-Z'’-]+){1,3})\b/,
  )
  if (findNamed?.[1] && !CARE_NOUN.test(findNamed[1])) {
    return cleanName(findNamed[1])
  }

  // Bare "First Last" (2–3 tokens), any casing
  const bare = text.match(
    /^\s*(?:Dr\.?\s+)?([A-Za-z][A-Za-z'’-]+(?:\s+[A-Za-z][A-Za-z'’-]+){1,2})\s*[?.!]?\s*$/,
  )
  if (bare?.[1]) {
    const cleaned = cleanName(
      bare[1]
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' '),
    )
    if (cleaned.split(/\s+/).length >= 2) return cleaned
  }

  return null
}

function cleanName(name) {
  return String(name || '')
    .replace(/\b(DO|MD|DPM|DDS|NP|PA)\b/gi, '')
    .replace(/[?.!,]+$/g, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w && !STOP_NAME.has(w.toLowerCase()))
    .join(' ')
}

function specialtyFromText(text) {
  for (const p of SPECIALTY_PATTERNS) {
    if (p.re.test(text)) {
      return {
        specialty: p.specialty,
        queryNoun: p.query,
        includedType: p.type,
      }
    }
  }
  return {
    specialty: 'Doctor',
    queryNoun: 'doctor',
    includedType: 'doctor',
  }
}

function buildIntent({ doctorName, where, specialty, queryNoun, includedType, mode }) {
  if (!where && !doctorName) return null
  const spec = specialty || 'Doctor'
  let textQuery
  if (doctorName && where) {
    textQuery = `${doctorName} doctor ${where}`
  } else if (doctorName) {
    textQuery = `${doctorName} doctor`
  } else {
    textQuery = `${queryNoun || 'primary care doctor'} near ${where}`
  }
  return {
    doctorName: doctorName || null,
    where: where || null,
    zip: extractZip(where || '') || null,
    specialty: doctorName ? spec : spec === 'Doctor' ? 'Primary care' : spec,
    textQuery,
    // Name searches: don't force includedType (misses some listings)
    includedType: doctorName ? null : includedType || 'doctor',
    mode: mode || (doctorName ? 'named' : 'area'),
  }
}

/**
 * Parse a single user message into a Places search intent (no pending context).
 * @returns {object|null}
 */
export function parseDoctorFindIntent(message) {
  const text = String(message || '').trim()
  if (!text) return null

  const doctorName = extractDoctorName(text)
  const where = extractWhere(text)
  const { specialty, queryNoun, includedType } = specialtyFromText(text)

  // Named doctor (+ optional location)
  if (doctorName && (where || FIND_VERB.test(text) || CARE_NOUN.test(text))) {
    return buildIntent({
      doctorName,
      where,
      specialty,
      queryNoun,
      includedType,
      mode: 'named',
    })
  }

  // Bare name only — caller may merge with pending where
  if (doctorName && !where && text.length < 60) {
    return buildIntent({
      doctorName,
      where: null,
      specialty,
      queryNoun,
      includedType,
      mode: 'named_partial',
    })
  }

  // Area / specialty search
  const wantsFind =
    FIND_VERB.test(text) ||
    (CARE_NOUN.test(text) && /\b(in|near|around|zip)\b/i.test(text))
  if (wantsFind && where && CARE_NOUN.test(text)) {
    return buildIntent({
      doctorName: null,
      where,
      specialty,
      queryNoun,
      includedType,
      mode: 'area',
    })
  }

  // Location-only line ("he is in Houston TX") — partial
  if (where && (LOCATION_ONLY.test(text) || (!doctorName && text.length < 80))) {
    if (CARE_NOUN.test(text) || LOCATION_ONLY.test(text) || extractZip(text)) {
      return buildIntent({
        doctorName: null,
        where,
        specialty,
        queryNoun,
        includedType,
        mode: 'location_partial',
      })
    }
  }

  return null
}

/**
 * Merge this turn with pending multi-turn find state.
 * @returns {{ intent: object|null, pending: object|null, ask: string|null, detail: object|null }}
 */
export function resolveDoctorFindIntent(message, pending = null) {
  const text = String(message || '').trim()
  if (!text) return { intent: null, pending, ask: null, detail: null }

  // "more details" / "detail of X" / "did you find him?" → last Places hits
  if (FOLLOW_UP_FIND.test(text) && pending?.lastResults?.length) {
    const detail = matchPlacesDetailRequest(text, pending.lastResults) || {
      doctors: pending.lastResults,
      focus: false,
    }
    return { intent: null, pending, ask: null, detail }
  }

  const parsed = parseDoctorFindIntent(text)
  const specialtyInfo = specialtyFromText(text)
  const isFreshAreaSearch =
    Boolean(parsed?.where) &&
    !extractDoctorName(text) &&
    CARE_NOUN.test(text) &&
    (FIND_VERB.test(text) || parsed?.mode === 'area')

  let doctorName = isFreshAreaSearch
    ? null
    : parsed?.doctorName || pending?.doctorName || null
  let where = parsed?.where || pending?.where || null
  const specialty =
    (parsed?.specialty && parsed.specialty !== 'Doctor'
      ? parsed.specialty
      : null) ||
    (isFreshAreaSearch ? specialtyInfo.specialty : null) ||
    pending?.specialty ||
    specialtyInfo.specialty
  const queryNoun = specialtyInfo.queryNoun
  const includedType = specialtyInfo.includedType

  // Location-only follow-up after a named doctor
  if (!parsed?.doctorName && parsed?.where && pending?.doctorName && !isFreshAreaSearch) {
    doctorName = pending.doctorName
    where = parsed.where
  }

  // Name-only follow-up after a location
  if (parsed?.doctorName && !parsed?.where && pending?.where) {
    doctorName = parsed.doctorName
    where = pending.where
  }

  // Complete named search
  if (doctorName && where) {
    const intent = buildIntent({
      doctorName,
      where,
      specialty,
      queryNoun,
      includedType,
      mode: 'named',
    })
    return {
      intent,
      pending: { ...intent, lastResults: pending?.lastResults || null },
      ask: null,
      detail: null,
    }
  }

  // Complete area search (no specific name)
  if (
    !doctorName &&
    where &&
    parsed?.mode === 'area' &&
    CARE_NOUN.test(text)
  ) {
    const intent = buildIntent({
      doctorName: null,
      where,
      specialty,
      queryNoun,
      includedType,
      mode: 'area',
    })
    return {
      intent,
      pending: { ...intent, lastResults: pending?.lastResults || null },
      ask: null,
      detail: null,
    }
  }

  // Partial: remember and ask
  if (doctorName && !where) {
    const next = {
      doctorName,
      where: null,
      specialty,
      queryNoun,
      includedType,
      textQuery: null,
      mode: 'named_partial',
      lastResults: pending?.lastResults || null,
    }
    return {
      intent: null,
      pending: next,
      ask: `Got it — searching for ${doctorName}. What city or ZIP should I search in?`,
      detail: null,
    }
  }

  if (where && !doctorName && (LOCATION_ONLY.test(text) || pending?.doctorName)) {
    if (pending?.doctorName) {
      // should have been handled above
    }
    const next = {
      doctorName: null,
      where,
      specialty,
      queryNoun,
      includedType,
      textQuery: null,
      mode: 'location_partial',
      lastResults: pending?.lastResults || null,
    }
    return {
      intent: null,
      pending: next,
      ask: `I’ll search near ${where}. What’s the doctor’s name (or say “primary care” / “dentist” for a general search)?`,
      detail: null,
    }
  }

  if (parsed?.mode === 'area' && where) {
    const intent = buildIntent({
      doctorName: null,
      where,
      specialty,
      queryNoun,
      includedType,
      mode: 'area',
    })
    return {
      intent,
      pending: { ...intent, lastResults: pending?.lastResults || null },
      ask: null,
      detail: null,
    }
  }

  return { intent: null, pending, ask: null, detail: null }
}

/** Pick one or all last Places doctors for a "show details" follow-up. */
export function matchPlacesDetailRequest(text, doctors) {
  const list = Array.isArray(doctors) ? doctors.filter(Boolean) : []
  if (!list.length) return null
  const lower = String(text || '').toLowerCase()

  const matched = list.filter((d) => {
    const name = String(d.name || '').toLowerCase()
    if (!name) return false
    if (lower.includes(name)) return true
    // partial: first + last token
    const parts = name.split(/\s+/).filter((w) => w.length > 2)
    if (parts.length >= 2) {
      const first = parts[0]
      const last = parts[parts.length - 1]
      if (lower.includes(first) && lower.includes(last)) return true
    }
    return parts.some((p) => p.length > 4 && lower.includes(p))
  })

  if (matched.length) {
    return { doctors: matched, focus: true }
  }
  // Generic "more details" → all
  if (/\b(more\s+)?detail|tell me (more|about)|what (about|is)|info\b/i.test(text)) {
    return { doctors: list, focus: false }
  }
  return null
}

export function formatDoctorDetailBlock(doctor) {
  const d = doctor || {}
  const office = Array.isArray(d.offices) ? d.offices[0] : null
  const addr = office
    ? [
        office.addressLine1,
        [office.city, office.region, office.postalCode].filter(Boolean).join(', '),
      ]
        .filter(Boolean)
        .join(', ')
    : ''
  const lines = [
    d.name || 'Doctor',
    d.specialty && `Specialty: ${d.specialty}`,
    office?.phone && `Phone: ${office.phone}`,
    addr && `Address: ${addr}`,
    d.website && `Website: ${d.website}`,
  ].filter(Boolean)
  return lines.join('\n')
}

export function placesDetailToTurn(detail, { actions } = {}) {
  const doctors = detail?.doctors || []
  if (!doctors.length) {
    return {
      assistant_message:
        'I don’t have Places details cached for that search anymore. Ask me to search again with the name and city/ZIP.',
      actions: [],
      warnings: [],
    }
  }
  const body = doctors.map((d) => formatDoctorDetailBlock(d)).join('\n\n')
  const keep = Array.isArray(actions)
    ? actions.filter((a) =>
        doctors.some(
          (d) =>
            a?.doctor?.name &&
            d?.name &&
            String(a.doctor.name).toLowerCase() === String(d.name).toLowerCase(),
        ),
      )
    : []
  return {
    assistant_message: `${
      doctors.length === 1
        ? 'Here are the Places details:'
        : 'Here are the Places details for those matches:'
    }\n\n${body}\n\nAccept below to save to your doctors list.`,
    actions: keep.length ? keep : actions || [],
    warnings: [],
  }
}

/**
 * Tool entry used by care-chat need_tool / search_doctors.
 * @param {{ textQuery: string, maxResults?: number }} args
 */
export async function runSearchDoctorsTool(args = {}) {
  const textQuery = String(args.textQuery || '').trim()
  if (!textQuery) {
    throw new Error('search_doctors requires textQuery')
  }
  if (!placesSearchConfigured()) {
    throw new Error(
      'Google Maps / Places is not configured (VITE_GOOGLE_MAPS_API_KEY).',
    )
  }
  const intent = {
    textQuery,
    where: null,
    doctorName: null,
    specialty: 'Doctor',
    includedType: null,
    mode: 'tool',
  }
  return searchDoctorsNear(intent, {
    maxResults: args.maxResults ?? 5,
  })
}

export function placesSearchConfigured() {
  return Boolean(GOOGLE_MAPS_API_KEY)
}

/**
 * Search Places and map hits to add_doctor action payloads.
 */
export async function searchDoctorsNear(intent, { maxResults = 5 } = {}) {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      'Google Maps / Places is not configured (VITE_GOOGLE_MAPS_API_KEY).',
    )
  }
  if (!intent?.textQuery) {
    throw new Error('Missing search query')
  }

  const body = {
    textQuery: intent.textQuery,
    languageCode: 'en',
    regionCode: 'US',
    maxResultCount: Math.min(8, Math.max(1, maxResults)),
  }
  if (intent.includedType) {
    body.includedType = intent.includedType
  }

  const res = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const short = detail.slice(0, 200)
    throw new Error(
      `Places search failed (${res.status})${short ? `: ${short}` : ''}`,
    )
  }

  const data = await res.json()
  const places = Array.isArray(data?.places) ? data.places : []
  const doctors = places.map((place) => placeToDoctorCandidate(place, intent))
  const actions = doctors.map((doctor) => ({
    type: 'add_doctor',
    label: `Add ${doctor.name}`,
    doctor,
  }))

  return { doctors, actions, query: intent }
}

function placeToDoctorCandidate(place, intent) {
  const name = placeDisplayName(place, 'Doctor')
  const office = placeToOffice(place, { label: 'Office' })
  const website = office.website
  delete office.website

  const primaryType =
    (typeof place?.primaryTypeDisplayName === 'string' &&
      place.primaryTypeDisplayName) ||
    (place?.primaryTypeDisplayName?.text &&
      String(place.primaryTypeDisplayName.text)) ||
    intent?.specialty ||
    'Doctor'

  const addr = parsePlaceAddress(place)
  const whereBits = [addr.city, addr.region, addr.postalCode]
    .filter(Boolean)
    .join(', ')

  return {
    name,
    specialty: intent?.doctorName
      ? primaryType || intent.specialty
      : intent?.specialty || primaryType,
    website: website || undefined,
    notes: whereBits
      ? `Found via Google Places near ${intent?.where || whereBits}.`
      : 'Found via Google Places.',
    offices: [office].filter(
      (o) =>
        o.addressLine1 ||
        o.phone ||
        o.googlePlaceId ||
        (o.lat != null && o.lng != null),
    ),
  }
}

export function placesResultsToTurn({ actions, query, errorMessage } = {}) {
  if (errorMessage) {
    return {
      assistant_message: errorMessage,
      actions: [],
      warnings: [],
    }
  }
  if (!actions?.length) {
    const who = query?.doctorName || query?.specialty || 'doctors'
    return {
      assistant_message: `I couldn’t find ${who} near ${query?.where || 'that area'} in Google Places. Try another spelling, city/ZIP, or share phone/address and I’ll add them manually.`,
      actions: [],
      warnings: [],
    }
  }
  const n = actions.length
  const label = query?.doctorName
    ? `match${n === 1 ? '' : 'es'} for ${query.doctorName}`
    : `${query?.specialty || 'care'} option${n === 1 ? '' : 's'}`
  const summaries = (actions || [])
    .map((a) => formatDoctorDetailBlock(a.doctor))
    .filter(Boolean)
    .join('\n\n')
  return {
    assistant_message: `I found ${n} ${label} near ${query?.where || 'your area'}:\n\n${summaries}\n\nAccept any to save to your doctors list.`,
    actions,
    warnings: [],
  }
}
