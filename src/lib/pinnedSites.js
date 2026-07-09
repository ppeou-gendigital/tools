// Pure helpers for the "pinned sites" list — the user-curated subset of
// hostnames that get a tree slide on the Site Tree page.
//
// Storage shape everywhere (chrome.storage.local, localStorage, Supabase
// user_data.pinned_sites) is a sorted array of lowercase hostname strings:
//
//   ["confluence.corp.example.com", "jira.corp.example.com"]
//
// Sorted lexicographically so the on-disk representation is stable across
// devices (no false-positive "dirty" states in the sync layer just because
// two clients wrote the same set in different insertion orders).

function isValidHost(v) {
  if (typeof v !== 'string') return false
  const trimmed = v.trim()
  if (!trimmed) return false
  // A hostname is anything that survives new URL() in http(s) form. We do
  // a light regex check first to avoid throwing for obvious junk.
  return /^[a-z0-9.-]+$/i.test(trimmed)
}

function toKey(v) {
  return String(v).trim().toLowerCase()
}

// Accept an array (canonical), a Set (in-memory), or unknown input; return
// a sorted, deduped, lowercased array of valid hostnames. Anything junk is
// dropped silently so a bad row can't crash the UI.
export function normalizePinnedSites(raw) {
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
  out.sort()
  return out
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
// pinned-sites list change since the last remote pull?". Since
// normalizePinnedSites already sorts + dedupes + lowercases, plain
// JSON.stringify is a stable digest.
export function stablePinnedKey(list) {
  return JSON.stringify(normalizePinnedSites(list))
}
