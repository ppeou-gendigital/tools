import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Archive,
  ArrowLeft,
  Check,
  Download,
  HardDriveDownload,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LoadingState } from '@/molecules/LoadingState'
import { Select } from '@/molecules/Select'
import { TimezoneAutocomplete } from '@/molecules/TimezoneAutocomplete'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { PageHeader } from '@/patterns/PageHeader'
import { COMMON_CURRENCIES } from '@/lib/catalog'
import {
  buildJourneySnapshot,
  downloadSnapshotJson,
  snapshotFilename,
} from '@/lib/journeySnapshot'
import {
  archiveJourney,
  deleteJourney,
  getJourney,
  myMembership,
  updateJourney,
} from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { cx } from '@/lib/cx'
import styles from './Page.module.scss'

export function JourneySettings() {
  const { params, goBack, previousRouteLabel, goHome } = useNavigation()
  const journeyId = params.journeyId
  const { user } = useAuth()

  const { data: journey, isLoading, isError, error } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: !!journeyId && !!user?.id,
  })

  if (!journeyId) {
    return (
      <div className={styles.page}>
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>Missing journey.</p>
          <Button variant="outline" onClick={goHome} fullWidth>
            Back to journeys
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Journey settings"
          leading={
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft size={14} aria-hidden="true" />
              {previousRouteLabel ?? 'Back'}
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <LoadingState>Loading journey settings…</LoadingState>
        </div>
      </div>
    )
  }

  if (isError || !journey) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Journey settings"
          leading={
            <Button variant="ghost" size="sm" onClick={goHome}>
              <ArrowLeft size={14} aria-hidden="true" />
              Home
            </Button>
          }
        />
        <div className={cx('is-fluid-width', styles.body)}>
          <p className={styles.error}>
            {isError
              ? `Could not load this journey. (${error.message})`
              : 'This journey was not found, or you no longer have access.'}
          </p>
          <Button onClick={goHome} fullWidth>
            Back to journeys
          </Button>
        </div>
      </div>
    )
  }

  return (
    <JourneySettingsForm
      key={journey.id}
      journey={journey}
      membership={membership}
      goBack={goBack}
      previousRouteLabel={previousRouteLabel}
      goHome={goHome}
    />
  )
}

function JourneySettingsForm({
  journey,
  membership,
  goBack,
  previousRouteLabel,
  goHome,
}) {
  const qc = useQueryClient()
  const { user } = useAuth()
  const {
    isPackAvailable,
    makeAvailableOffline,
    removeAvailableOffline,
    getPack,
    refreshPacks,
  } = useOffline()
  const [error, setError] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'archive' | 'delete' | null
  const [busy, setBusy] = useState(false)
  const [offlineBusy, setOfflineBusy] = useState(false)
  const [offlineSyncedAt, setOfflineSyncedAt] = useState(null)
  const packReady = isPackAvailable(journey.id)
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const isOwner = membership?.role === 'owner'

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const pack = await getPack(journey.id)
      if (mounted) setOfflineSyncedAt(pack?.syncedAt ?? null)
    })()
    return () => {
      mounted = false
    }
  }, [journey.id, getPack, packReady])

  const [title, setTitle] = useState(journey.title || '')
  const [startsOn, setStartsOn] = useState(journey.startsOn || '')
  const [endsOn, setEndsOn] = useState(journey.endsOn || '')
  const [timezone, setTimezone] = useState(journey.defaultTimezone || '')
  const [currency, setCurrency] = useState(journey.defaultCurrency || '')

  const dateRangeInvalid =
    Boolean(startsOn) && Boolean(endsOn) && endsOn < startsOn

  const isDirty = useMemo(() => {
    const norm = (v) => (v == null ? '' : String(v))
    return (
      norm(title) !== norm(journey.title) ||
      norm(startsOn) !== norm(journey.startsOn) ||
      norm(endsOn) !== norm(journey.endsOn) ||
      norm(timezone) !== norm(journey.defaultTimezone) ||
      norm(currency) !== norm(journey.defaultCurrency)
    )
  }, [title, startsOn, endsOn, timezone, currency, journey])

  const saveMut = useMutation({
    mutationFn: () =>
      updateJourney(journey.id, {
        title,
        startsOn: startsOn || null,
        endsOn: endsOn || null,
        defaultTimezone: timezone,
        defaultCurrency: currency,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'journey', journey.id] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 2000)
    },
    onError: (err) => setError(err.message),
  })

  async function runArchive() {
    setBusy(true)
    setError('')
    try {
      const snap = await buildJourneySnapshot(journey.id)
      await archiveJourney(journey.id, snap)
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'archives'] })
      goHome()
    } catch (err) {
      setError(err.message)
      setBusy(false)
      setConfirm(null)
    }
  }

  async function runDelete() {
    setBusy(true)
    setError('')
    try {
      await deleteJourney(journey.id)
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      goHome()
    } catch (err) {
      setError(err.message)
      setBusy(false)
      setConfirm(null)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Journey settings"
        subtitle={journey.title}
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        actions={
          canEdit ? (
            <div className={styles.toolbar}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.iconBtn}
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                disabled={
                  !isDirty ||
                  dateRangeInvalid ||
                  saveMut.isPending
                }
                aria-label={
                  saveMut.isPending
                    ? 'Saving…'
                    : savedFlash
                      ? 'Saved'
                      : 'Save changes'
                }
                title={
                  saveMut.isPending
                    ? 'Saving…'
                    : savedFlash
                      ? 'Saved'
                      : 'Save changes'
                }
              >
                {saveMut.isPending ? (
                  <Loader2
                    size={14}
                    aria-hidden="true"
                    className={styles.spin}
                  />
                ) : savedFlash ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <Save size={14} aria-hidden="true" />
                )}
              </Button>
            </div>
          ) : null
        }
      />
      <div className={cx('is-fluid-width', styles.body)}>
        {!canEdit && (
          <p className={styles.readOnlyBanner}>
            You can view these settings. Only editors can change them.
          </p>
        )}
        <div className={cx(styles.form, styles.formNarrow)}>
          <div className={styles.field}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              disabled={!canEdit}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Label htmlFor="starts">Starts</Label>
              <Input
                id="starts"
                type="date"
                value={startsOn}
                disabled={!canEdit}
                onChange={(e) => setStartsOn(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="ends">Ends</Label>
              <Input
                id="ends"
                type="date"
                value={endsOn}
                disabled={!canEdit}
                onChange={(e) => setEndsOn(e.target.value)}
              />
            </div>
          </div>
          {dateRangeInvalid && (
            <p className={styles.error} role="alert">
              End date can’t be before the start date.
            </p>
          )}
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Label htmlFor="tz">Default timezone</Label>
              <TimezoneAutocomplete
                id="tz"
                value={timezone}
                disabled={!canEdit}
                onChange={setTimezone}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="cur">Default currency</Label>
              <Select
                id="cur"
                value={currency}
                disabled={!canEdit}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {savedFlash && (
            <p className={styles.hint} role="status">
              <Check size={12} aria-hidden="true" /> Saved.
            </p>
          )}

          <p className={styles.sectionTitle}>Available offline</p>
          <p className={styles.hint}>
            Save this journey on this device for airplane mode. Includes
            timeline, spending, to-dos, travelers, places, playlist links, and
            prefetched currency rates.
          </p>
          {packReady && offlineSyncedAt && (
            <p className={styles.hint} role="status">
              Last synced{' '}
              {new Date(offlineSyncedAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}
          <Button
            variant="outline"
            fullWidth
            disabled={offlineBusy}
            onClick={async () => {
              setError('')
              setOfflineBusy(true)
              try {
                const pack = await makeAvailableOffline(journey.id, {
                  userId: user?.id,
                })
                setOfflineSyncedAt(pack.syncedAt)
                await refreshPacks()
              } catch (err) {
                setError(err.message)
              } finally {
                setOfflineBusy(false)
              }
            }}
          >
            {offlineBusy ? (
              <Loader2 size={16} className={styles.spin} aria-hidden="true" />
            ) : (
              <HardDriveDownload size={16} aria-hidden="true" />
            )}
            {packReady ? 'Refresh offline copy' : 'Make available offline'}
          </Button>
          {packReady && (
            <Button
              variant="ghost"
              fullWidth
              disabled={offlineBusy}
              onClick={async () => {
                setError('')
                setOfflineBusy(true)
                try {
                  await removeAvailableOffline(journey.id)
                  setOfflineSyncedAt(null)
                } catch (err) {
                  setError(err.message)
                } finally {
                  setOfflineBusy(false)
                }
              }}
            >
              <Trash2 size={16} aria-hidden="true" />
              Remove offline copy
            </Button>
          )}

          <p className={styles.sectionTitle}>Export</p>
          <p className={styles.hint}>
            Download a full copy of this journey as a file you can keep offline.
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={async () => {
              setError('')
              try {
                const snap = await buildJourneySnapshot(journey.id)
                downloadSnapshotJson(snap, snapshotFilename(snap))
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            <Download size={16} aria-hidden="true" />
            Export journey
          </Button>

          {isOwner && (
            <div className={styles.dangerZone}>
              <p className={styles.sectionTitle}>Danger zone</p>
              <p className={styles.hint}>
                Archive removes the live journey but keeps a restorable copy.
                Delete removes it permanently.
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setConfirm('archive')}
              >
                <Archive size={16} aria-hidden="true" />
                Archive journey
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={() => setConfirm('delete')}
              >
                Delete journey
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'archive'}
        onDismiss={() => !busy && setConfirm(null)}
        title="Archive this journey?"
        message="Live data will be removed and stored so you can restore it later from Archives."
        confirmLabel="Archive"
        busyLabel="Archiving…"
        confirming={busy}
        onConfirm={runArchive}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        onDismiss={() => !busy && setConfirm(null)}
        title="Delete this journey?"
        message="Permanently delete this journey and all its data. Prefer Archive if you might need it later."
        confirmLabel="Delete forever"
        busyLabel="Deleting…"
        confirming={busy}
        onConfirm={runDelete}
      />
    </div>
  )
}
