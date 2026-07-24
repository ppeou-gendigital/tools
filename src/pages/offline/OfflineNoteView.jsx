import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { RichNoteEditor } from '@/molecules/RichNoteEditor'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useLockbox } from '@/providers/LockboxProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { effectiveLockboxId } from '@/lib/workspaceModel'
import { OfflineBanner } from './OfflineBanner'
import styles from './Offline.module.scss'

export function OfflineNoteView() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { primaryPack } = useOffline()
  const {
    ready,
    activeNoteId,
    getNote,
    setActiveNoteId,
    workspace,
  } = useNotes()
  const { revealNoteContent, requestUnlock, isUnlocked } = useLockbox()
  const [content, setContent] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!ready || !activeNoteId) {
        setContent(null)
        return
      }
      const note = getNote(activeNoteId)
      if (!note) {
        setContent(null)
        return
      }
      const lbId = effectiveLockboxId(workspace, note)
      if (lbId && note.ciphertext && !isUnlocked(lbId)) {
        try {
          await requestUnlock(lbId)
        } catch {
          if (!cancelled) {
            setLoadError('Unlock cancelled.')
            setContent(null)
          }
          return
        }
      }
      try {
        const revealed = await revealNoteContent(activeNoteId)
        if (!cancelled) {
          setContent(revealed)
          setLoadError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message ?? String(err))
          setContent(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [
    ready,
    activeNoteId,
    getNote,
    revealNoteContent,
    requestUnlock,
    isUnlocked,
    workspace,
  ])

  function handleBack() {
    setActiveNoteId(null)
    goBack()
  }

  if (!ready || (activeNoteId && content === null && !loadError)) {
    return (
      <div className={styles.page}>
        <PageHeader title="Note" />
        <div className={styles.body}>
          <p className={styles.loading}>{loadError || 'Loading…'}</p>
        </div>
      </div>
    )
  }

  if (!activeNoteId || (!content && loadError)) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Note"
          leading={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className={styles.back}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {previousRouteLabel ?? 'Notes'}
            </Button>
          }
        />
        <div className={styles.body}>
          <p className={styles.error}>
            {loadError || 'This note is not available offline.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Note"
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {previousRouteLabel ?? 'Notes'}
          </Button>
        }
      />
      <div className={styles.body}>
        <OfflineBanner syncedAt={primaryPack?.syncedAt} />
        <h1 className={styles.titleField}>
          {content?.title?.trim() || 'Untitled'}
        </h1>
        <RichNoteEditor value={content?.body ?? ''} disabled />
      </div>
    </div>
  )
}
