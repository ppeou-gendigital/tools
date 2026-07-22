import { useRef, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Download,
  Loader2,
  TriangleAlert,
  Upload,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import {
  DATAFEED_TYPES,
  datafeedFilename,
  downloadTextFile,
  importDatafeedItems,
  parseDatafeed,
  stringifyDatafeed,
} from '@/lib/datafeed'
import {
  exportPatientDatafeed,
  exportTypedDatafeed,
} from '@/lib/datafeed/buildFromVault'
import styles from './DatafeedSettings.module.scss'
import settings from './Settings.module.scss'

export function DatafeedSettings() {
  const { user } = useAuth()
  const { goBack, previousRouteLabel } = useNavigation()
  const vault = usePatientVault()
  const fileRef = useRef(null)

  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const canWrite = vault.canWrite
  const unlocked = vault.isUnlocked
  const exporting = typeof busy === 'string' && busy.startsWith('export')
  const importing = busy === 'import'

  function clearMessages() {
    setError(null)
    setResult(null)
  }

  async function handleExport(kind) {
    if (!unlocked || exporting || importing) return
    clearMessages()
    setBusy(`export-${kind}`)
    try {
      const key = vault.getKey()
      let doc
      if (kind === DATAFEED_TYPES.PATIENT) {
        doc = await exportPatientDatafeed({
          patientId: vault.patientId,
          key,
          patient: vault.patient,
        })
      } else {
        doc = await exportTypedDatafeed({
          patientId: vault.patientId,
          key,
          type: kind,
        })
      }
      downloadTextFile(datafeedFilename(kind), stringifyDatafeed(doc))
      setResult({
        kind: 'export',
        message: `Downloaded ${datafeedFilename(kind)}`,
      })
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  function handlePickFile() {
    if (!unlocked || !canWrite || exporting || importing) return
    clearMessages()
    fileRef.current?.click()
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!user?.id || !unlocked || !canWrite) {
      setError('Unlock with Can help / Owner access before importing.')
      return
    }

    setBusy('import')
    clearMessages()
    try {
      const text = await file.text()
      const feed = parseDatafeed(text)
      const imported = await importDatafeedItems({
        userId: user.id,
        patientId: vault.patientId,
        key: vault.getKey(),
        feed,
      })
      const created =
        imported.doctorsCreated +
        imported.appointmentsCreated +
        imported.visitsCreated +
        imported.medicationsCreated +
        imported.dosesCreated +
        imported.readingsCreated +
        imported.filesCreated
      setResult({
        kind: 'import',
        message: [
          imported.patientUpdated ? 'Patient profile updated.' : null,
          `Created ${created} record${created === 1 ? '' : 's'}.`,
          feed.errors.length
            ? `${feed.errors.length} item(s) skipped during parse.`
            : null,
          imported.failures.length
            ? `${imported.failures.length} save failure(s).`
            : null,
        ]
          .filter(Boolean)
          .join(' '),
        parseErrors: feed.errors,
        failures: imported.failures,
      })
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className={settings.page}>
      <div className={settings.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className={settings.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={settings.headerText}>
          <h1 className={settings.title}>Import / Export</h1>
          <p className={settings.subtitle}>
            JSON datafeeds for the active patient. Spec and samples live in{' '}
            <code>datafeed/</code>.
          </p>
        </div>
      </div>

      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Export</h2>
            <p className={styles.sectionBody}>
              Downloads plaintext health data for this patient. Store the file
              somewhere safe. Binary uploads (photos/PDFs) are not included.
            </p>
            <p className={styles.warn}>
              Exported JSON is unencrypted. Anyone with the file can read it.
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              size="sm"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.PATIENT)}
            >
              {busy === 'export-patient' ? (
                <Loader2 size={14} className={styles.spin} />
              ) : (
                <Download size={14} aria-hidden="true" />
              )}
              Full patient
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.DOCTORS)}
            >
              Doctors
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.MEDICATIONS)}
            >
              Medications
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.APPOINTMENTS)}
            >
              Appointments
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.VISITS)}
            >
              Visits
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.READINGS)}
            >
              Readings
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || exporting || importing}
              onClick={() => handleExport(DATAFEED_TYPES.FILES)}
            >
              Files
            </Button>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Import</h2>
            <p className={styles.sectionBody}>
              Accepts datafeed version 1 (<code>type: patient</code> or a typed
              collection). Items are created as new rows — no merge. Hand{' '}
              <code>datafeed/README.md</code> to another system so it can export
              this shape.
            </p>
            {!canWrite && (
              <p className={styles.warn}>
                Can view access is read-only — switch to a patient you Can help
                or own to import.
              </p>
            )}
          </div>
          <div className={styles.actions}>
            <Button
              size="sm"
              variant="outline"
              disabled={!unlocked || !canWrite || exporting || importing}
              onClick={handlePickFile}
            >
              {importing ? (
                <Loader2 size={14} className={styles.spin} />
              ) : (
                <Upload size={14} aria-hidden="true" />
              )}
              Choose JSON file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
          </div>
        </section>

        {error && (
          <p className={`${styles.status} ${styles.statusError}`}>
            <TriangleAlert size={14} aria-hidden="true" />
            {error}
          </p>
        )}
        {result && (
          <div className={`${styles.status} ${styles.statusOk}`}>
            <Check size={14} aria-hidden="true" />
            <div>
              <p style={{ margin: 0 }}>{result.message}</p>
              {result.parseErrors?.length > 0 && (
                <ul className={styles.failureList}>
                  {result.parseErrors.slice(0, 8).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              {result.failures?.length > 0 && (
                <ul className={styles.failureList}>
                  {result.failures.slice(0, 8).map((f, i) => (
                    <li key={`${f.kind}-${i}`}>
                      {f.kind}
                      {f.name || f.title ? ` “${f.name || f.title}”` : ''}:{' '}
                      {f.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
