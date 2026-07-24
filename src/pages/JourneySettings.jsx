import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, ArrowLeft, Check, Download, Loader2 } from 'lucide-react'
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
              <ArrowLeft size={14} />
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
              <ArrowLeft size={14} />
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
  const [error, setError] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'archive' | 'delete' | null
  const [busy, setBusy] = useState(false)
  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'
  const isOwner = membership?.role === 'owner'

  const [title, setTitle] = useState(journey.title || '')
  const [startsOn, setStartsOn] = useState(journey.startsOn || '')
  const [endsOn, setEndsOn] = useState(journey.endsOn || '')
  const [timezone, setTimezone] = useState(journey.defaultTimezone || '')
  const [currency, setCurrency] = useState(journey.defaultCurrency || '')

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
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
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

          {canEdit && (
            <div className={styles.actionsSticky}>
              <Button
                onClick={() => {
                  setError('')
                  saveMut.mutate()
                }}
                disabled={saveMut.isPending}
              >
                {saveMut.isPending ? (
                  <>
                    <Loader2 size={14} aria-hidden="true" />
                    Saving
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          )}

          <p className={styles.sectionTitle}>Export & archive</p>
          <p className={styles.hint}>
            Export downloads a full copy of this journey as a file you can keep.
            Archive stores that copy and removes the live journey — restore later
            from Archives.
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
            <Download size={16} />
            Export journey
          </Button>

          {isOwner && (
            <div className={styles.dangerZone}>
              <p className={styles.sectionTitle}>Danger zone</p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setConfirm('archive')}
              >
                <Archive size={16} />
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
