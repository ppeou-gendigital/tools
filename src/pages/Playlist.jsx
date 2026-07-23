import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import {
  addPlaylistItem,
  deletePlaylistItem,
  detectPlaylistPlatform,
  getJourney,
  listPlaylist,
  myMembership,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  apple_music: 'Apple Music',
  soundcloud: 'SoundCloud',
  vimeo: 'Vimeo',
  tiktok: 'TikTok',
  link: 'Link',
}

export function Playlist() {
  const { params, goBack, previousRouteLabel } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()
  const qc = useQueryClient()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  const {
    data: items = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['viaggio', 'playlist', journeyId],
    queryFn: () => listPlaylist(journeyId),
    enabled: !!journeyId,
  })

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const detected = detectPlaylistPlatform(url)

  const addMut = useMutation({
    mutationFn: () =>
      addPlaylistItem(
        journeyId,
        { url: url.trim(), title: title.trim() },
        user.id,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'playlist', journeyId] })
      setUrl('')
      setTitle('')
    },
    onError: (err) => setError(err.message),
  })

  return (
    <div className={styles.page}>
      <PageHeader
        title="Playlist"
        subtitle={journey?.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh playlist"
            title="Refresh"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Refresh
          </Button>
        }
      />
      <div className={styles.body}>
        {isLoading && <LoadingState>Loading playlist…</LoadingState>}
        {!isLoading && items.length === 0 && (
          <div className={styles.empty}>
            <p>Share YouTube, Spotify, or other links for the group.</p>
            {canEdit ? (
              <p className={styles.hint}>Paste a URL below to add the first link.</p>
            ) : (
              <p className={styles.hint}>Ask an editor to add links.</p>
            )}
          </div>
        )}
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.block}>
              <div className={styles.rowBody}>
                {item.platform && (
                  <span className={styles.badge}>
                    {PLATFORM_LABELS[item.platform] || item.platform}
                  </span>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.rowTitle}
                >
                  {item.title || item.url}{' '}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
                <span className={styles.rowMeta}>{item.url}</span>
              </div>
              {canEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove ${item.title || 'link'}`}
                  onClick={async () => {
                    await deletePlaylistItem(item.id)
                    qc.invalidateQueries({
                      queryKey: ['viaggio', 'playlist', journeyId],
                    })
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </li>
          ))}
        </ul>

        {canEdit && (
          <div className={styles.form}>
            <p className={styles.sectionTitle}>Add link</p>
            <div className={styles.field}>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/… or open.spotify.com/…"
                inputMode="url"
              />
              {detected && (
                <p className={styles.hint}>
                  Detected: {PLATFORM_LABELS[detected] || detected}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional label"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <Button
              disabled={!url.trim() || addMut.isPending}
              onClick={() => {
                setError('')
                addMut.mutate()
              }}
            >
              <Plus size={14} />
              {addMut.isPending ? 'Adding…' : 'Add link'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
