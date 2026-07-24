import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseMediaLink } from '@/lib/mediaEmbed'
import { listPlaylist } from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'

const PlaylistPlaybackContext = createContext(null)

function playableIndexes(items) {
  return items
    .map((item, i) => ({ i, target: parseMediaLink(item.url) }))
    .filter((x) => x.target.playable)
    .map((x) => x.i)
}

export function PlaylistPlaybackProvider({ children }) {
  const { user } = useAuth()
  const [journeyId, setJourneyId] = useState(null)
  const [trackId, setTrackId] = useState(null)
  const [playNonce, setPlayNonce] = useState(0)
  const [active, setActive] = useState(false)
  const [playerSlot, setPlayerSlot] = useState(null)

  const { data: items = [] } = useQuery({
    queryKey: ['viaggio', 'playlist', journeyId],
    queryFn: () => listPlaylist(journeyId),
    enabled: !!journeyId && !!user?.id,
  })

  const currentIndex = useMemo(() => {
    if (!trackId || items.length === 0) return -1
    return items.findIndex((i) => i.id === trackId)
  }, [items, trackId])

  const currentItem =
    currentIndex >= 0 && currentIndex < items.length
      ? items[currentIndex]
      : null

  const stop = useCallback(() => {
    setActive(false)
    setJourneyId(null)
    setTrackId(null)
    setPlayNonce(0)
  }, [])

  // Clear playback on sign-out.
  useEffect(() => {
    if (!user) stop()
  }, [user, stop])

  // If the playing track was deleted, clear or jump to nearest playable.
  useEffect(() => {
    if (!active || !journeyId) return
    if (items.length === 0) {
      stop()
      return
    }
    if (trackId && currentIndex < 0) {
      const playable = playableIndexes(items)
      if (playable.length === 0) {
        stop()
        return
      }
      setTrackId(items[playable[0]].id)
    }
  }, [active, journeyId, items, trackId, currentIndex, stop])

  const playAt = useCallback(
    ({ journeyId: jid, trackId: tid, autoplay = true }) => {
      if (!jid || !tid) return
      setJourneyId(jid)
      setTrackId(tid)
      setActive(true)
      if (autoplay) setPlayNonce((n) => n + 1)
    },
    [],
  )

  const setIndex = useCallback(
    (index, { autoplay = false } = {}) => {
      if (!journeyId || index < 0 || index >= items.length) return
      setTrackId(items[index].id)
      setActive(true)
      if (autoplay) setPlayNonce((n) => n + 1)
    },
    [journeyId, items],
  )

  const step = useCallback(
    (delta, { autoplay = true } = {}) => {
      if (!journeyId || items.length === 0) return
      const playable = playableIndexes(items)
      if (playable.length === 0) return
      const pos = playable.indexOf(currentIndex)
      const nextPos =
        pos < 0
          ? delta > 0
            ? 0
            : playable.length - 1
          : pos + delta
      if (nextPos < 0 || nextPos >= playable.length) return
      setTrackId(items[playable[nextPos]].id)
      setActive(true)
      if (autoplay) setPlayNonce((n) => n + 1)
    },
    [journeyId, items, currentIndex],
  )

  const registerPlayerSlot = useCallback((el) => {
    setPlayerSlot(el)
  }, [])

  const value = useMemo(
    () => ({
      active,
      journeyId,
      trackId,
      playNonce,
      items,
      currentIndex,
      currentItem,
      playerSlot,
      playAt,
      setIndex,
      step,
      stop,
      next: () => step(1, { autoplay: true }),
      prev: () => step(-1, { autoplay: true }),
      registerPlayerSlot,
    }),
    [
      active,
      journeyId,
      trackId,
      playNonce,
      items,
      currentIndex,
      currentItem,
      playerSlot,
      playAt,
      setIndex,
      step,
      stop,
      registerPlayerSlot,
    ],
  )

  return (
    <PlaylistPlaybackContext.Provider value={value}>
      {children}
    </PlaylistPlaybackContext.Provider>
  )
}

export function usePlaylistPlayback() {
  const ctx = useContext(PlaylistPlaybackContext)
  if (!ctx) {
    throw new Error(
      'usePlaylistPlayback must be used within PlaylistPlaybackProvider',
    )
  }
  return ctx
}
