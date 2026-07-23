import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { LoadingState } from '@/molecules/LoadingState'
import { PageHeader } from '@/patterns/PageHeader'
import {
  deleteJourneyArchive,
  getJourneyArchive,
  listJourneyArchives,
} from '@/lib/viaggioApi'
import {
  downloadSnapshotJson,
  importJourneySnapshot,
  readSnapshotFile,
  snapshotFilename,
} from '@/lib/journeySnapshot'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import styles from './Page.module.scss'

function formatBytes(n) {
  if (n == null || Number.isNaN(n)) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function formatWhen(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function Archives() {
  const { goBack, previousRouteLabel, goHome, goJourney } = useNavigation()
  const { user } = useAuth()
  const qc = useQueryClient()
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { data: archives = [], isLoading } = useQuery({
    queryKey: ['viaggio', 'archives'],
    queryFn: listJourneyArchives,
  })

  const importMut = useMutation({
    mutationFn: async (file) => {
      const snap = await readSnapshotFile(file)
      return importJourneySnapshot(snap, { user })
    },
    onSuccess: ({ journey }) => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      setMessage(`Imported “${journey.title}”.`)
      setError('')
      goJourney(journey.id)
    },
    onError: (err) => {
      setError(err.message)
      setMessage('')
    },
  })

  const restoreMut = useMutation({
    mutationFn: async (archiveId) => {
      const row = await getJourneyArchive(archiveId)
      if (!row?.snapshot) throw new Error('Archive snapshot missing')
      const result = await importJourneySnapshot(row.snapshot, { user })
      await deleteJourneyArchive(archiveId)
      return result
    },
    onSuccess: ({ journey }) => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'archives'] })
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      setMessage(`Restored “${journey.title}”.`)
      setError('')
      goJourney(journey.id)
    },
    onError: (err) => {
      setError(err.message)
      setMessage('')
    },
  })

  return (
    <div className={styles.page}>
      <PageHeader
        title="Archives & import"
        subtitle="Restore archived journeys or import a Viaggio JSON snapshot"
        leading={
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft size={14} />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
      />
      <div className={styles.body}>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.hint}>{message}</p>}

        <section className={styles.form}>
          <p className={styles.sectionTitle}>Import JSON</p>
          <p className={styles.hint}>
            Compatible with format <code>viaggio.journey_snapshot</code> v1. See{' '}
            <code>docs/journey-snapshot.md</code> and{' '}
            <code>src/samples/journey-snapshot.sample.json</code>.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) importMut.mutate(file)
            }}
          />
          <Button
            fullWidth
            disabled={importMut.isPending}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={16} />
            {importMut.isPending ? 'Importing…' : 'Import journey JSON'}
          </Button>
        </section>

        <section className={styles.form}>
          <p className={styles.sectionTitle}>Archived journeys</p>
          {isLoading && <LoadingState>Loading archives…</LoadingState>}
          {!isLoading && archives.length === 0 && (
            <div className={styles.empty}>
              <p>No archives yet. Archive a journey from its settings.</p>
              <Button variant="outline" onClick={goHome}>
                Back to journeys
              </Button>
            </div>
          )}
          <ul className={styles.list}>
            {archives.map((a) => (
              <li key={a.id} className={styles.block}>
                <div className={styles.rowBody}>
                  <span className={styles.rowTitle}>{a.title}</span>
                  <span className={styles.rowMeta}>
                    {[
                      formatWhen(a.archivedAt),
                      a.byteSize != null ? formatBytes(a.byteSize) : null,
                      `v${a.snapshotVersion}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                <div className={styles.actions}>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={restoreMut.isPending}
                    onClick={async () => {
                      try {
                        const row = await getJourneyArchive(a.id)
                        if (!row?.snapshot) throw new Error('Snapshot missing')
                        downloadSnapshotJson(
                          row.snapshot,
                          snapshotFilename(row.snapshot),
                        )
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    <Download size={14} />
                    JSON
                  </Button>
                  <Button
                    size="sm"
                    disabled={restoreMut.isPending}
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Restore “${a.title}” as a new journey? The archive entry will be removed.`,
                        )
                      ) {
                        return
                      }
                      restoreMut.mutate(a.id)
                    }}
                  >
                    <RotateCcw size={14} />
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Permanently delete archive “${a.title}”? This cannot be undone.`,
                        )
                      ) {
                        return
                      }
                      try {
                        await deleteJourneyArchive(a.id)
                        qc.invalidateQueries({
                          queryKey: ['viaggio', 'archives'],
                        })
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Button variant="ghost" onClick={goHome} fullWidth>
          Back to journeys
        </Button>
      </div>
    </div>
  )
}
