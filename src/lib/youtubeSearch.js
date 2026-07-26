import { GOOGLE_MAPS_API_KEY, YOUTUBE_API_KEY } from '@/env'
import { parseMediaLink } from '@/lib/mediaEmbed'

/** Prefer dedicated YouTube key; fall back to Maps key (same GCP project). */
export function youtubeApiKey() {
  return String(YOUTUBE_API_KEY || GOOGLE_MAPS_API_KEY || '').trim()
}

export function isYoutubeSearchConfigured() {
  return Boolean(youtubeApiKey())
}

/**
 * Search YouTube Data API v3 for the best matching video.
 * @param {string} query
 * @returns {Promise<{ url: string, title: string, videoId: string } | null>}
 */
export async function searchYoutubeVideo(query) {
  const q = String(query || '').trim()
  if (!q) return null
  const key = youtubeApiKey()
  if (!key) {
    throw new Error(
      'YouTube search is not configured. Enable YouTube Data API v3 and set VITE_YOUTUBE_API_KEY or VITE_GOOGLE_MAPS_API_KEY.',
    )
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: '1',
    q,
    key,
  })
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
  )
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      `YouTube search failed (${res.status})`
    throw new Error(msg)
  }
  const item = data?.items?.[0]
  const videoId = item?.id?.videoId
  if (!videoId) return null
  const title = String(item?.snippet?.title || q).trim() || q
  return {
    videoId,
    title,
    url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
  }
}

/**
 * Ensure playlist rows have playable YouTube URLs (search by title/query when needed).
 * @param {Array<{ title?: string, url?: string|null, platform?: string|null, search_query?: string, id?: string }>} items
 */
export async function resolvePlaylistItems(items) {
  const list = Array.isArray(items) ? items : []
  const out = []
  for (const item of list.slice(0, 12)) {
    const title = String(item?.title || '').trim() || 'Track'
    const existing = String(item?.url || '').trim()
    if (existing && parseMediaLink(existing).playable) {
      out.push({
        ...item,
        title,
        url: existing,
        platform: item.platform || 'youtube',
      })
      continue
    }
    const query = String(item?.search_query || title).trim()
    if (!query) continue
    try {
      const hit = await searchYoutubeVideo(query)
      if (!hit) {
        continue
      }
      out.push({
        ...item,
        title: title !== 'Track' ? title : hit.title,
        url: hit.url,
        platform: 'youtube',
        search_query: undefined,
      })
    } catch (err) {
      // Surface first hard config/API error; skip soft misses.
      if (!youtubeApiKey() || /not configured|YouTube search failed|API/i.test(err.message)) {
        throw err
      }
    }
  }
  return out
}
