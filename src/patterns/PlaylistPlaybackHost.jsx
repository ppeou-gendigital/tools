import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { PlaylistPlayer } from '@/molecules/PlaylistPlayer'
import { useNavigation } from '@/providers/NavigationProvider'
import { usePlaylistPlayback } from '@/providers/PlaylistPlaybackProvider'
import { cx } from '@/lib/cx'
import styles from './PlaylistPlaybackHost.module.scss'

function sameOverlay(a, b) {
  if (a == null && b == null) return true
  if (a == null || b == null) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  )
}

/**
 * Owns the single playlist iframe for the whole app (never unmounts on route change).
 * On the Playlist page for the active journey, positions over the page slot;
 * elsewhere shows a Spotify / YouTube Music–style now-playing bar.
 */
export function PlaylistPlaybackHost() {
  const {
    active,
    journeyId,
    playNonce,
    items,
    currentIndex,
    playerSlot,
    setIndex,
    stop,
  } = usePlaylistPlayback()
  const { route, params, goPlaylist } = useNavigation()
  const dockRef = useRef(null)
  const [overlay, setOverlay] = useState(null)

  const onPlaylistPage =
    route === 'playlist' &&
    !!journeyId &&
    params.journeyId === journeyId &&
    !!playerSlot

  const onIndexChange = useCallback(
    (index) => {
      setIndex(index)
    },
    [setIndex],
  )

  useLayoutEffect(() => {
    if (!onPlaylistPage || !playerSlot) {
      setOverlay((prev) => (prev == null ? prev : null))
      return undefined
    }

    const shell = dockRef.current?.closest('[data-app-shell]')
    if (!shell) return undefined

    function update() {
      const slotRect = playerSlot.getBoundingClientRect()
      const shellRect = shell.getBoundingClientRect()
      const next = {
        top: slotRect.top - shellRect.top,
        left: slotRect.left - shellRect.left,
        width: slotRect.width,
        height: Math.max(slotRect.height, 1),
      }
      setOverlay((prev) => (sameOverlay(prev, next) ? prev : next))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(playerSlot)
    const main = shell.querySelector('main')
    main?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      main?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onPlaylistPage, playerSlot])

  if (!active || !journeyId) return null

  const isOverlay = !!overlay

  return (
    <div
      ref={dockRef}
      className={cx(
        styles.dock,
        isOverlay ? styles.dockOverlay : styles.dockMini,
      )}
      style={
        isOverlay
          ? {
              top: overlay.top,
              left: overlay.left,
              width: overlay.width,
              height: overlay.height,
            }
          : undefined
      }
      data-playlist-dock={isOverlay ? 'full' : 'mini'}
    >
      <PlaylistPlayer
        items={items}
        currentIndex={currentIndex}
        playNonce={playNonce}
        compact={!isOverlay}
        className={isOverlay ? styles.fullPlayer : styles.miniPlayer}
        onIndexChange={onIndexChange}
        onTitleClick={
          isOverlay ? undefined : () => goPlaylist(journeyId)
        }
        onStop={isOverlay ? undefined : stop}
      />
    </div>
  )
}
