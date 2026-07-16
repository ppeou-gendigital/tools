// Pure helpers for the Fav Links domain-order list — the user-curated
// display sequence for domain groups on the Fav Links page.
//
// Storage shape everywhere (chrome.storage.local, localStorage, Supabase
// user_data.favorites_order) is an ordered array of lowercase hostname
// strings:
//
//   ["confluence.corp.example.com", "jira.corp.example.com"]
//
// The array order is meaningful — it drives the Fav Links group order.
// New entries append implicitly (i.e. any hostname in `byDomain` not
// present in the order array falls to the bottom on render); explicit
// reorder actions (moveFavoriteDomain below) shuffle neighbors.
//
// Since order carries user intent, the sync layer's stable-key digest
// (see stableFavoritesOrderKey) is order-sensitive too: swapping two
// domains on one device propagates to the other, and last-writer wins.

function isValidHost(v) {
  if (typeof v !== 'string') return false
  const trimmed = v.trim()
  if (!trimmed) return false
  return /^[a-z0-9.-]+$/i.test(trimmed)
}

function toKey(v) {
  return String(v).trim().toLowerCase()
}

// Accept an array (canonical), a Set (in-memory), or unknown input;
// return a deduped, lowercased array of valid hostnames — preserving
// input order. Anything junk is dropped silently so a bad row can't
// crash the UI.
export function normalizeFavoritesOrder(raw) {
  const source = normalizeToArray(raw)
  const seen = new Set()
  const out = []
  for (const entry of source) {
    if (!isValidHost(entry)) continue
    const key = toKey(entry)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
}

// Move a hostname up (-1) or down (+1) among the domain-order list.
// Returns a *new* array. Pure so React state comparisons stay simple.
//
// No-ops:
//   - host is not in the list -> list returned as-is
//   - direction is 0 (or not ±1) -> list returned as-is
//   - moving up from index 0 or down from the last index -> as-is
export function moveFavoriteDomain(list, host, direction) {
  const arr = normalizeFavoritesOrder(list)
  const key = toKey(host ?? '')
  if (!key) return arr
  const from = arr.indexOf(key)
  if (from === -1) return arr
  const delta = Math.sign(direction ?? 0)
  if (delta === 0) return arr
  const to = from + delta
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

// Accept several shapes seen in the wild:
//   - Array of strings (canonical)
//   - JSON-stringified array (localStorage / setItem writes)
//   - Set (in-memory)
//   - null / anything else -> empty
function normalizeToArray(raw) {
  if (raw == null) return []
  if (raw instanceof Set) return [...raw]
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // fall through to empty
    }
  }
  return []
}

// Cheap deterministic key used by the sync layer to answer "did the
// domain-order list change since the last remote pull?". Order-
// sensitive: a reorder is a "change" and should propagate to the cloud
// + other devices.
export function stableFavoritesOrderKey(list) {
  return JSON.stringify(normalizeFavoritesOrder(list))
}
