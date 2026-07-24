/**
 * Parse share links into embeddable media targets.
 * YouTube / Spotify / Vimeo / SoundCloud — iframe embeds only (MV3-safe).
 */

/**
 * @typedef {{
 *   platform: 'youtube'|'spotify'|'vimeo'|'soundcloud'|'unknown',
 *   kind: string,
 *   id: string|null,
 *   raw: string,
 *   playable: boolean
 * }} MediaTarget
 */

/** @param {string} url @returns {MediaTarget} */
export function parseMediaLink(url) {
  const raw = String(url || '').trim()
  if (!raw) {
    return { platform: 'unknown', kind: 'link', id: null, raw, playable: false }
  }
  try {
    const u = new URL(raw.includes('://') ? raw : `https://${raw}`)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')

    if (host === 'youtu.be' || host.endsWith('youtube.com')) {
      if (host === 'youtu.be') {
        const id = u.pathname.replace(/^\//, '').split('/')[0] || null
        return {
          platform: 'youtube',
          kind: 'video',
          id,
          raw,
          playable: !!id,
        }
      }
      if (u.pathname.startsWith('/embed/')) {
        const id = u.pathname.split('/embed/')[1]?.split('/')[0] || null
        return {
          platform: 'youtube',
          kind: 'video',
          id,
          raw,
          playable: !!id,
        }
      }
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/shorts/')[1]?.split('/')[0] || null
        return {
          platform: 'youtube',
          kind: 'video',
          id,
          raw,
          playable: !!id,
        }
      }
      const videoId = u.searchParams.get('v')
      const list = u.searchParams.get('list')
      if (videoId) {
        return {
          platform: 'youtube',
          kind: 'video',
          id: videoId,
          raw,
          playable: true,
        }
      }
      if (list) {
        return {
          platform: 'youtube',
          kind: 'playlist',
          id: list,
          raw,
          playable: true,
        }
      }
      return {
        platform: 'youtube',
        kind: 'link',
        id: null,
        raw,
        playable: false,
      }
    }

    if (host.endsWith('spotify.com')) {
      const parts = u.pathname.split('/').filter(Boolean)
      // open.spotify.com/track|album|playlist|episode|show/ID
      const kind = parts[0]
      const id = parts[1]?.split('?')[0] || null
      const allowed = new Set([
        'track',
        'album',
        'playlist',
        'episode',
        'show',
      ])
      if (kind && id && allowed.has(kind)) {
        return { platform: 'spotify', kind, id, raw, playable: true }
      }
      return {
        platform: 'spotify',
        kind: kind || 'link',
        id,
        raw,
        playable: false,
      }
    }

    if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
      return parseVimeo(u, raw)
    }

    if (
      host === 'soundcloud.com' ||
      host.endsWith('.soundcloud.com') ||
      host === 'on.soundcloud.com'
    ) {
      return parseSoundCloud(u, raw)
    }
  } catch {
    // fall through
  }
  return { platform: 'unknown', kind: 'link', id: null, raw, playable: false }
}

/** @param {URL} u @param {string} raw */
function parseVimeo(u, raw) {
  const parts = u.pathname.split('/').filter(Boolean)

  // player.vimeo.com/video/ID
  if (u.hostname.includes('player.vimeo.com') && parts[0] === 'video') {
    const id = parts[1]?.split('?')[0] || null
    return {
      platform: 'vimeo',
      kind: 'video',
      id,
      raw,
      playable: !!id && /^\d+$/.test(id),
    }
  }

  // vimeo.com/ID
  if (parts.length === 1 && /^\d+$/.test(parts[0])) {
    return {
      platform: 'vimeo',
      kind: 'video',
      id: parts[0],
      raw,
      playable: true,
    }
  }

  // vimeo.com/channels/…/ID | groups/…/videos/ID | manage/videos/ID
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (/^\d+$/.test(parts[i])) {
      return {
        platform: 'vimeo',
        kind: 'video',
        id: parts[i],
        raw,
        playable: true,
      }
    }
  }

  return {
    platform: 'vimeo',
    kind: 'link',
    id: null,
    raw,
    playable: false,
  }
}

/** @param {URL} u @param {string} raw */
function parseSoundCloud(u, raw) {
  const parts = u.pathname.split('/').filter(Boolean)
  // Homepage / discover — not playable
  if (parts.length === 0) {
    return {
      platform: 'soundcloud',
      kind: 'link',
      id: null,
      raw,
      playable: false,
    }
  }

  // soundcloud.com/artist/sets/name → playlist
  // soundcloud.com/artist/track → track
  // on.soundcloud.com/… short links — still embeddable via full URL
  const isSet = parts.includes('sets')
  const kind = isSet ? 'playlist' : 'track'
  // Widget accepts the page URL; keep pathname as a stable id key.
  const id = u.origin + u.pathname.replace(/\/$/, '')
  return {
    platform: 'soundcloud',
    kind,
    id,
    raw,
    playable: true,
  }
}

/** @param {MediaTarget} target @param {{ autoplay?: boolean, origin?: string }} [opts] */
export function embedUrlFor(target, opts = {}) {
  const autoplay = opts.autoplay ? 1 : 0
  if (!target?.playable || !target.id) return null

  if (target.platform === 'youtube') {
    const origin =
      opts.origin ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    const params = new URLSearchParams({
      enablejsapi: '1',
      rel: '0',
      autoplay: String(autoplay),
    })
    if (origin) params.set('origin', origin)
    if (target.kind === 'playlist') {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(target.id)}&${params}`
    }
    return `https://www.youtube.com/embed/${encodeURIComponent(target.id)}?${params}`
  }

  if (target.platform === 'spotify') {
    const q = new URLSearchParams({ utm_source: 'generator' })
    if (autoplay) q.set('autoplay', '1')
    return `https://open.spotify.com/embed/${encodeURIComponent(target.kind)}/${encodeURIComponent(target.id)}?${q}`
  }

  if (target.platform === 'vimeo') {
    const q = new URLSearchParams({
      // Enables postMessage API without loading player.js
      api: '1',
      autopause: '1',
      autoplay: String(autoplay),
      title: '0',
      byline: '0',
    })
    return `https://player.vimeo.com/video/${encodeURIComponent(target.id)}?${q}`
  }

  if (target.platform === 'soundcloud') {
    // Widget plays from the share URL (track or set).
    const shareUrl = target.raw.includes('://')
      ? target.raw
      : `https://${target.raw}`
    const q = new URLSearchParams({
      url: shareUrl,
      color: '%23ff5500',
      auto_play: autoplay ? 'true' : 'false',
      hide_related: 'true',
      show_comments: 'false',
      show_user: 'true',
      show_reposts: 'false',
      show_teaser: 'false',
      visual: 'true',
    })
    return `https://w.soundcloud.com/player/?${q}`
  }

  return null
}

/** Platforms that use a 16:9 video frame (vs compact audio widgets). */
export function isVideoPlatform(platform) {
  return platform === 'youtube' || platform === 'vimeo'
}

/** Platforms that reliably signal “ended” for auto-advance. */
export function supportsAutoAdvance(platform) {
  return platform === 'youtube' || platform === 'vimeo'
}

export function platformLabel(platform) {
  if (platform === 'youtube') return 'YouTube'
  if (platform === 'spotify') return 'Spotify'
  if (platform === 'vimeo') return 'Vimeo'
  if (platform === 'soundcloud') return 'SoundCloud'
  return 'Link'
}
