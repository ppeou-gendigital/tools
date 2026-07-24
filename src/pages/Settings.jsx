import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  HardDriveDownload,
  Loader2,
  Lock,
  Trash2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { usePrompt } from '@/providers/PromptProvider'
import {
  saveWorkspaceSemver,
  wipeUserCloudWorkspace,
} from '@/lib/notasApi'
import {
  emptyWorkspace,
  serializeWorkspace,
  WORKSPACE_STORAGE_KEY,
} from '@/lib/workspaceModel'
import { SEMVER_WIPE } from '@/lib/workspaceSemver'
import { asyncStorage } from '@/lib/storage'
import styles from './Settings.module.scss'

export function Settings() {
  const { goBack, previousRouteLabel, goLockboxes } = useNavigation()
  const { user } = useAuth()
  const { setWorkspaceFromRemote } = useNotes()
  const {
    makeAvailableOffline,
    removeAvailableOffline,
    refreshPacks,
    isPackAvailable,
    getPack,
  } = useOffline()
  const { confirm } = usePrompt()
  const [wiping, setWiping] = useState(false)
  const [offlineBusy, setOfflineBusy] = useState(false)
  const [offlineError, setOfflineError] = useState('')
  const [offlineSyncedAt, setOfflineSyncedAt] = useState(null)

  const userId = user?.id ?? null
  const packReady = userId ? isPackAvailable(userId) : false

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!userId) {
        setOfflineSyncedAt(null)
        return
      }
      const pack = await getPack(userId)
      if (!cancelled) setOfflineSyncedAt(pack?.syncedAt ?? null)
    })()
    return () => {
      cancelled = true
    }
  }, [userId, getPack, packReady])

  async function handleResetAll() {
    if (!user?.id || wiping) return
    const ok = await confirm({
      title: 'Reset all Notas data?',
      message:
        'This permanently deletes notebooks, notes, tags, and lockboxes from this account in the cloud and on this device. This cannot be undone.',
      confirmLabel: 'Delete everything',
      cancelLabel: 'Cancel',
      destructive: true,
    })
    if (!ok) return

    setWiping(true)
    try {
      await saveWorkspaceSemver(user.id, SEMVER_WIPE)
      await wipeUserCloudWorkspace(user.id)
      const wiped = emptyWorkspace()
      setWorkspaceFromRemote(wiped)
      await asyncStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        serializeWorkspace(wiped),
      )
    } catch (err) {
      console.error('[notas] reset all failed:', err)
      await confirm({
        title: 'Reset failed',
        message: err?.message ?? 'Could not reset workspace data.',
        confirmLabel: 'OK',
        cancelLabel: 'Dismiss',
      })
    } finally {
      setWiping(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        subtitle="App preferences and shortcuts."
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Back'}
          </Button>
        }
        shortcuts={
          <PageShortcuts current="settings" className={styles.iconBtn} />
        }
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Available offline</h2>
        <p className={styles.hint}>
          Save your notebooks and notes on this device for airplane mode.
          Locked notes stay encrypted; unlock each lockbox offline with its
          passphrase. Attachments are not included.
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
        {offlineError && (
          <p className={styles.error} role="alert">
            {offlineError}
          </p>
        )}
        <div className={styles.offlineActions}>
          <Button
            variant="outline"
            fullWidth
            disabled={!userId || offlineBusy}
            onClick={async () => {
              if (!userId) return
              setOfflineError('')
              setOfflineBusy(true)
              try {
                const pack = await makeAvailableOffline(userId)
                setOfflineSyncedAt(pack.syncedAt)
                await refreshPacks()
              } catch (err) {
                setOfflineError(err?.message ?? String(err))
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
                if (!userId) return
                setOfflineError('')
                setOfflineBusy(true)
                try {
                  await removeAvailableOffline(userId)
                  setOfflineSyncedAt(null)
                } catch (err) {
                  setOfflineError(err?.message ?? String(err))
                } finally {
                  setOfflineBusy(false)
                }
              }}
            >
              <Trash2 size={16} aria-hidden="true" />
              Remove offline copy
            </Button>
          )}
        </div>
      </section>

      <ul className={styles.cards}>
        <SettingsCard
          icon={Lock}
          title="Lockboxes"
          description="Passphrases, biometrics, and notebook protection."
          onClick={goLockboxes}
        />
        <SettingsCard
          icon={Trash2}
          title="Reset all data"
          description={
            wiping
              ? 'Deleting cloud and local workspace…'
              : 'Wipe notebooks, notes, and lockboxes (semver -1).'
          }
          onClick={handleResetAll}
          disabled={!user?.id || wiping}
          destructive
        />
      </ul>
    </div>
  )
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
  destructive = false,
}) {
  return (
    <li className={styles.cardItem}>
      <button
        type="button"
        className={destructive ? `${styles.card} ${styles.cardDanger}` : styles.card}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={styles.cardIcon} aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{title}</span>
          <span className={styles.cardDescription}>{description}</span>
        </span>
      </button>
    </li>
  )
}
