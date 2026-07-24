import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  ExternalLink,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  X,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import {
  embedUrlFor,
  isVideoPlatform,
  parseMediaLink,
  platformLabel,
  supportsAutoAdvance,
} from '@/lib/mediaEmbed'
import { cx } from '@/lib/cx'
import styles from './PlaylistPlayer.module.scss'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

function postPlayerCommand(iframe, platform, func, args = []) {
  if (!iframe?.contentWindow) return
  try {
    if (platform === 'youtube') {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*',
      )
    } else if (platform === 'vimeo') {
      const payload =
        args.length > 0
          ? { method: func, value: args[0] }
          : { method: func }
      iframe.contentWindow.postMessage(JSON.stringify(payload), '*')
    }
  } catch {
    // ignore
  }
}

/**
 * In-page playlist player. Transport chrome matches a minimal progress +
 * shuffle / prev / play / next / repeat control bar.
 */
export function PlaylistPlayer({
  items = [],
  currentIndex,
  onIndexChange,
  playNonce = 0,
  compact = false,
  onTitleClick,
  onStop,
  className,
}) {
  const frameId = useId().replace(/:/g, '')
  const iframeRef = useRef(null)
  const [autoplay, setAutoplay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(/** @type {'off'|'all'|'one'} */ ('off'))
  const stateRef = useRef({
    items,
    currentIndex,
    onIndexChange,
    shuffle,
    repeat,
  })
  stateRef.current = {
    items,
    currentIndex,
    onIndexChange,
    shuffle,
    repeat,
  }

  useEffect(() => {
    if (playNonce > 0) {
      setAutoplay(true)
      setIsPlaying(true)
    }
  }, [playNonce])

  useEffect(() => {
    setCurrentTime(0)
    setDuration(0)
  }, [currentIndex])

  const playableIndexes = useMemo(
    () =>
      items
        .map((item, i) => ({ i, target: parseMediaLink(item.url) }))
        .filter((x) => x.target.playable)
        .map((x) => x.i),
    [items],
  )

  const safeIndex =
    currentIndex >= 0 && currentIndex < items.length ? currentIndex : -1
  const currentItem = safeIndex >= 0 ? items[safeIndex] : null
  const target = currentItem ? parseMediaLink(currentItem.url) : null
  const embedSrc = target
    ? embedUrlFor(target, {
        autoplay,
        origin:
          typeof window !== 'undefined' ? window.location.origin : '',
      })
    : null
  const videoFrame = target ? isVideoPlatform(target.platform) : false
  const canTogglePlayback =
    target?.platform === 'youtube' || target?.platform === 'vimeo'
  const canSeek =
    target?.platform === 'youtube' || target?.platform === 'vimeo'

  const title =
    currentItem?.title?.trim() ||
    (target?.playable
      ? `${target.kind} · ${target.id}`
      : currentItem?.url || 'Nothing playing yet')

  const subtitle = [
    target ? platformLabel(target.platform) : null,
    safeIndex >= 0 ? `${safeIndex + 1} of ${items.length}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  function selectIndex(i, withAutoplay) {
    if (i < 0 || i >= items.length) return
    setAutoplay(!!withAutoplay)
    if (withAutoplay) setIsPlaying(true)
    onIndexChange?.(i)
  }

  function stepFromState(delta, withAutoplay = true) {
    const {
      items: list,
      currentIndex: idx,
      onIndexChange: setIdx,
      shuffle: doShuffle,
      repeat: repeatMode,
    } = stateRef.current
    const playable = list
      .map((item, i) => ({ i, target: parseMediaLink(item.url) }))
      .filter((x) => x.target.playable)
      .map((x) => x.i)
    if (playable.length === 0) return

    if (repeatMode === 'one' && delta === 1) {
      const iframe = iframeRef.current
      const platform = parseMediaLink(list[idx]?.url || '').platform
      if (platform === 'youtube' || platform === 'vimeo') {
        postPlayerCommand(
          iframe,
          platform,
          platform === 'vimeo' ? 'setCurrentTime' : 'seekTo',
          platform === 'vimeo' ? [0] : [0, true],
        )
        postPlayerCommand(
          iframe,
          platform,
          platform === 'vimeo' ? 'play' : 'playVideo',
        )
        setCurrentTime(0)
        setIsPlaying(true)
        return
      }
    }

    let nextIndex
    if (doShuffle && playable.length > 1) {
      const others = playable.filter((i) => i !== idx)
      nextIndex = others[Math.floor(Math.random() * others.length)]
    } else {
      const pos = playable.indexOf(idx)
      let nextPos =
        pos < 0 ? (delta > 0 ? 0 : playable.length - 1) : pos + delta
      if (nextPos < 0 || nextPos >= playable.length) {
        if (repeatMode === 'all') {
          nextPos = delta > 0 ? 0 : playable.length - 1
        } else {
          return
        }
      }
      nextIndex = playable[nextPos]
    }

    setAutoplay(!!withAutoplay)
    if (withAutoplay) setIsPlaying(true)
    setIdx?.(nextIndex)
  }

  function togglePlayback() {
    const platform = target?.platform
    const iframe = iframeRef.current
    if (!platform) return

    if (canTogglePlayback && iframe) {
      if (isPlaying) {
        postPlayerCommand(
          iframe,
          platform,
          platform === 'vimeo' ? 'pause' : 'pauseVideo',
        )
        setIsPlaying(false)
      } else {
        postPlayerCommand(
          iframe,
          platform,
          platform === 'vimeo' ? 'play' : 'playVideo',
        )
        setIsPlaying(true)
        setAutoplay(true)
      }
      return
    }

    const i =
      safeIndex >= 0 && parseMediaLink(items[safeIndex].url).playable
        ? safeIndex
        : playableIndexes[0]
    selectIndex(i, true)
  }

  function seekTo(seconds) {
    if (!canSeek || !target) return
    const t = Math.max(0, Math.min(seconds, duration || seconds))
    setCurrentTime(t)
    postPlayerCommand(
      iframeRef.current,
      target.platform,
      target.platform === 'vimeo' ? 'setCurrentTime' : 'seekTo',
      target.platform === 'vimeo' ? [t] : [t, true],
    )
  }

  function cycleRepeat() {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
  }

  useEffect(() => {
    if (safeIndex >= 0) return
    if (playableIndexes.length === 0) return
    onIndexChange?.(playableIndexes[0])
    setAutoplay(false)
    setIsPlaying(false)
  }, [safeIndex, playableIndexes, onIndexChange])

  useEffect(() => {
    function onMessage(event) {
      const origin = event.origin
      let data = event.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch {
          return
        }
      }
      if (!data || typeof data !== 'object') return

      if (
        origin === 'https://www.youtube.com' ||
        origin === 'https://www.youtube-nocookie.com'
      ) {
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            setCurrentTime(data.info.currentTime)
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration)
          }
          if (typeof data.info.playerState === 'number') {
            const state = data.info.playerState
            if (state === 1 || state === 3) setIsPlaying(true)
            if (state === 2) setIsPlaying(false)
            if (state === 0) {
              setIsPlaying(false)
              stepFromState(1, true)
            }
          }
        }
        if (data.event === 'onStateChange') {
          const state = data.info
          if (state === 1 || state === 3) setIsPlaying(true)
          if (state === 2) setIsPlaying(false)
          if (state === 0) {
            setIsPlaying(false)
            stepFromState(1, true)
          }
        }
        return
      }

      if (origin === 'https://player.vimeo.com') {
        if (data.event === 'play' || data.event === 'playing') {
          setIsPlaying(true)
        }
        if (data.event === 'pause') setIsPlaying(false)
        if (data.event === 'timeupdate' && data.data) {
          if (typeof data.data.seconds === 'number') {
            setCurrentTime(data.data.seconds)
          }
          if (typeof data.data.duration === 'number') {
            setDuration(data.data.duration)
          }
        }
        if (data.event === 'ended' || data.event === 'finish') {
          setIsPlaying(false)
          stepFromState(1, true)
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Poll YT/Vimeo for time while playing.
  useEffect(() => {
    if (!isPlaying || !canSeek || !target) return undefined
    const iframe = iframeRef.current
    if (!iframe) return undefined
    const id = window.setInterval(() => {
      if (target.platform === 'youtube') {
        postPlayerCommand(iframe, 'youtube', 'getCurrentTime', [])
        postPlayerCommand(iframe, 'youtube', 'getDuration', [])
      } else if (target.platform === 'vimeo') {
        postPlayerCommand(iframe, 'vimeo', 'getCurrentTime')
        postPlayerCommand(iframe, 'vimeo', 'getDuration')
      }
    }, 500)
    return () => window.clearInterval(id)
  }, [isPlaying, canSeek, target?.platform])

  useEffect(() => {
    if (!embedSrc || !target) return
    const iframe = iframeRef.current
    if (!iframe) return
    const platform = target.platform

    function announce() {
      try {
        if (platform === 'youtube') {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening', id: frameId }),
            '*',
          )
          iframe.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'addEventListener',
              args: ['onStateChange'],
            }),
            '*',
          )
        } else if (platform === 'vimeo') {
          for (const value of [
            'ended',
            'finish',
            'play',
            'pause',
            'timeupdate',
          ]) {
            iframe.contentWindow?.postMessage(
              JSON.stringify({ method: 'addEventListener', value }),
              '*',
            )
          }
        }
      } catch {
        // ignore
      }
    }

    iframe.addEventListener('load', announce)
    const timer = window.setTimeout(announce, 500)
    return () => {
      iframe.removeEventListener('load', announce)
      window.clearTimeout(timer)
    }
  }, [embedSrc, target?.platform, frameId])

  const playablePos = playableIndexes.indexOf(safeIndex)
  const atFirst =
    !shuffle &&
    repeat !== 'all' &&
    (playableIndexes.length === 0 || playablePos <= 0)
  const atLast =
    !shuffle &&
    repeat !== 'all' &&
    repeat !== 'one' &&
    (playableIndexes.length === 0 ||
      playablePos >= playableIndexes.length - 1)

  if (items.length === 0) return null

  const manualAdvance =
    target?.playable && !supportsAutoAdvance(target.platform)
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  const frame = (
    <div className={styles.frameWrap}>
      {embedSrc ? (
        videoFrame ? (
          <div className={styles.videoWrap}>
            <iframe
              key={embedSrc}
              ref={iframeRef}
              id={`media-${frameId}`}
              title={title}
              src={embedSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              tabIndex={compact ? -1 : 0}
            />
          </div>
        ) : (
          <iframe
            key={embedSrc}
            ref={iframeRef}
            className={cx(
              styles.audioFrame,
              target.platform === 'soundcloud' && styles.soundcloudFrame,
            )}
            title={title}
            src={embedSrc}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            tabIndex={compact ? -1 : 0}
          />
        )
      ) : (
        <div className={styles.unsupported}>
          {compact ? (
            <span aria-hidden="true" />
          ) : (
            <>
              <p>
                {currentItem
                  ? 'This link can’t play in Viaggio. Open it in the browser.'
                  : 'Pick a YouTube, Spotify, Vimeo, or SoundCloud link.'}
              </p>
              {currentItem?.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(currentItem.url, '_blank', 'noreferrer')
                  }
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  Open link
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )

  const transport = (
    <div className={styles.transport}>
      <div className={styles.scrub}>
        <input
          type="range"
          className={styles.scrubInput}
          min={0}
          max={duration || 1}
          step={0.1}
          value={duration ? currentTime : 0}
          disabled={!canSeek || duration <= 0}
          aria-label="Seek"
          onChange={(e) => seekTo(Number(e.target.value))}
          style={{ '--progress': `${progress}%` }}
        />
        <div className={styles.times}>
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : '—:—'}</span>
        </div>
      </div>

      <div className={styles.transportRow}>
        <button
          type="button"
          className={cx(styles.iconBtn, shuffle && styles.iconBtnOn)}
          aria-label="Shuffle"
          aria-pressed={shuffle}
          onClick={() => setShuffle((s) => !s)}
        >
          <Shuffle size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          disabled={atFirst}
          onClick={() => stepFromState(-1, true)}
          aria-label="Previous"
        >
          <SkipBack size={22} aria-hidden="true" fill="currentColor" />
        </button>
        <button
          type="button"
          className={styles.playCircle}
          disabled={playableIndexes.length === 0}
          onClick={togglePlayback}
          aria-label={isPlaying && canTogglePlayback ? 'Pause' : 'Play'}
        >
          {isPlaying && canTogglePlayback ? (
            <Pause size={22} aria-hidden="true" fill="currentColor" />
          ) : (
            <Play
              size={22}
              aria-hidden="true"
              fill="currentColor"
              className={styles.playIcon}
            />
          )}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          disabled={atLast}
          onClick={() => stepFromState(1, true)}
          aria-label="Next"
        >
          <SkipForward size={22} aria-hidden="true" fill="currentColor" />
        </button>
        <button
          type="button"
          className={cx(styles.iconBtn, repeat !== 'off' && styles.iconBtnOn)}
          aria-label={
            repeat === 'one'
              ? 'Repeat one'
              : repeat === 'all'
                ? 'Repeat all'
                : 'Repeat off'
          }
          aria-pressed={repeat !== 'off'}
          onClick={cycleRepeat}
        >
          {repeat === 'one' ? (
            <Repeat1 size={18} aria-hidden="true" />
          ) : (
            <Repeat size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <section
        className={cx(styles.root, styles.compact, className)}
        aria-label="Now playing"
      >
        <div className={styles.compactTop}>
          <button
            type="button"
            className={styles.compactHit}
            onClick={onTitleClick}
            title="Open playlist"
          >
            {frame}
            <span className={styles.compactMeta}>
              <span className={styles.npTitle}>{title}</span>
              <span className={styles.npSub}>{subtitle}</span>
            </span>
          </button>
          {onStop && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onStop}
              aria-label="Close player"
              title="Close"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
        {transport}
      </section>
    )
  }

  return (
    <section className={cx(styles.root, className)} aria-label="Playlist player">
      {frame}

      <div className={styles.nowPlaying}>
        <p className={styles.npLabel}>
          {target ? platformLabel(target.platform) : '—'}
          {safeIndex >= 0 ? ` · ${safeIndex + 1} of ${items.length}` : ''}
        </p>
        <p className={styles.npTitle}>{title}</p>
        {manualAdvance && (
          <p className={styles.npHint}>
            {platformLabel(target.platform)} doesn’t auto-advance — use Next
            when it ends.
          </p>
        )}
      </div>

      {transport}
    </section>
  )
}
