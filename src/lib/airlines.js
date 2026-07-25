/**
 * Common IATA airlines for flight entry autocomplete.
 * Free-text IATA (2 letters) is always accepted even if not listed.
 */

/** @type {{ iata: string, name: string }[]} */
export const AIRLINES = [
  { iata: 'AA', name: 'American Airlines' },
  { iata: 'AC', name: 'Air Canada' },
  { iata: 'AF', name: 'Air France' },
  { iata: 'AI', name: 'Air India' },
  { iata: 'AM', name: 'Aeroméxico' },
  { iata: 'AS', name: 'Alaska Airlines' },
  { iata: 'AY', name: 'Finnair' },
  { iata: 'AZ', name: 'ITA Airways' },
  { iata: 'BA', name: 'British Airways' },
  { iata: 'B6', name: 'JetBlue' },
  { iata: 'CX', name: 'Cathay Pacific' },
  { iata: 'DE', name: 'Condor' },
  { iata: 'DL', name: 'Delta Air Lines' },
  { iata: 'EK', name: 'Emirates' },
  { iata: 'EY', name: 'Etihad Airways' },
  { iata: 'F9', name: 'Frontier Airlines' },
  { iata: 'FI', name: 'Icelandair' },
  { iata: 'FR', name: 'Ryanair' },
  { iata: 'IB', name: 'Iberia' },
  { iata: 'JL', name: 'Japan Airlines' },
  { iata: 'KE', name: 'Korean Air' },
  { iata: 'KL', name: 'KLM' },
  { iata: 'LA', name: 'LATAM' },
  { iata: 'LH', name: 'Lufthansa' },
  { iata: 'LO', name: 'LOT Polish Airlines' },
  { iata: 'LX', name: 'SWISS' },
  { iata: 'NH', name: 'ANA' },
  { iata: 'NK', name: 'Spirit Airlines' },
  { iata: 'NZ', name: 'Air New Zealand' },
  { iata: 'OS', name: 'Austrian Airlines' },
  { iata: 'QF', name: 'Qantas' },
  { iata: 'QR', name: 'Qatar Airways' },
  { iata: 'SK', name: 'SAS' },
  { iata: 'SN', name: 'Brussels Airlines' },
  { iata: 'SQ', name: 'Singapore Airlines' },
  { iata: 'TK', name: 'Turkish Airlines' },
  { iata: 'TP', name: 'TAP Air Portugal' },
  { iata: 'UA', name: 'United Airlines' },
  { iata: 'U2', name: 'easyJet' },
  { iata: 'VS', name: 'Virgin Atlantic' },
  { iata: 'VY', name: 'Vueling' },
  { iata: 'WN', name: 'Southwest Airlines' },
  { iata: 'WS', name: 'WestJet' },
].sort((a, b) => a.name.localeCompare(b.name))

/**
 * @param {string} query
 * @param {number} [limit]
 */
export function filterAirlines(query, limit = 12) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return AIRLINES.slice(0, limit)

  const scored = []
  for (const a of AIRLINES) {
    const iata = a.iata.toLowerCase()
    const name = a.name.toLowerCase()
    let score = 0
    if (iata === q) score = 100
    else if (iata.startsWith(q)) score = 80
    else if (name.startsWith(q)) score = 60
    else if (name.includes(q)) score = 40
    else if (`${iata} ${name}`.includes(q)) score = 20
    if (score > 0) scored.push({ a, score })
  }
  scored.sort((x, y) => y.score - x.score || x.a.name.localeCompare(y.a.name))
  return scored.slice(0, limit).map((s) => s.a)
}

/** @param {string} iata */
export function airlineLabel(iata) {
  const code = String(iata || '')
    .trim()
    .toUpperCase()
  if (!code) return ''
  const found = AIRLINES.find((a) => a.iata === code)
  return found ? `${found.iata} · ${found.name}` : code
}
