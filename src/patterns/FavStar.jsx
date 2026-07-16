import { useMemo } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useFavorites } from '@/providers/FavoritesProvider'
import { isJumpableUrl } from '@/lib/activeTab'
import { cx } from '@/lib/cx'
import styles from './FavStar.module.scss'

// Toggle button used wherever a URL needs a "save to Fav Links"
// affordance:
//   - PageShortcuts toolbar (captures the current tab)
//   - Site Tree tree rows  (captures the row's URL)
//   - Fav Links page header (captures the current tab)
//
// The button is self-sufficient: it parses the URL, reads current
// favorited state, and toggles via the FavoritesProvider on click.
// Callers just pass `url` and (optionally) `title`.
//
// Disabled states (renders greyed out, no-op on click):
//   - `url` is falsy or not http(s)
//   - explicit `disabled` prop
//   - provider not ready yet
//   - user is signed out (`canModify` is false). Favorites are
//     online-only per plan: local-only saves would silently drift
//     from Supabase, so we gate the affordance instead of pretending
//     the click worked.
export function FavStar({ url, title, size = 14, className, disabled }) {
  const {
    addFavorite,
    removeFavorite,
    isFavorited,
    ready,
    canModify,
  } = useFavorites()

  // Memoize the parse so the render path is cheap. Returns null when
  // the URL doesn't resolve to a real http(s) target — callers rely on
  // this to grey the star out for chrome:// / about: / empty inputs.
  const parts = useMemo(() => parseUrl(url), [url])

  const active = parts ? isFavorited(parts.hostname, parts.path) : false
  const isDisabled = disabled || !ready || !parts || !canModify

  const label = !canModify
    ? 'Sign in to save favorites'
    : active
      ? 'Remove from Fav Links'
      : 'Save to Fav Links'

  const onClick = () => {
    if (isDisabled || !parts) return
    if (active) {
      removeFavorite(parts.hostname, parts.path)
    } else {
      addFavorite({
        hostname: parts.hostname,
        path: parts.path,
        title: (title ?? '').trim(),
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cx(styles.star, active && styles.active, className)}
    >
      <Star
        size={size}
        aria-hidden="true"
        // Fill when active so the state is obvious at a glance. Outline
        // otherwise — Lucide's Star renders as an outline by default.
        fill={active ? 'currentColor' : 'none'}
      />
    </Button>
  )
}

// Parse a URL into the (hostname, path+search) pair the storage layer
// keys on. Returns null for anything that isn't a real http(s) URL —
// callers use that to disable the star, so chrome:// / about: /
// file:// don't accidentally get "favorited" as a broken row.
function parseUrl(input) {
  if (!isJumpableUrl(input)) return null
  try {
    const u = new URL(input)
    const hostname = u.hostname.toLowerCase()
    if (!hostname) return null
    // Include the hash so hash-routed SPAs (notably AEM's Sites console
    // at `#/aem/sites.html/...`) get treated as distinct favorites per
    // route rather than collapsing to the origin. Cost is a slightly
    // noisier list when a user favorites the same page with different
    // in-page anchors, but that's a rare pattern next to the everyday
    // case of AEM tools that live entirely inside the hash.
    const path = `${u.pathname || '/'}${u.search || ''}${u.hash || ''}`
    return { hostname, path }
  } catch {
    return null
  }
}
