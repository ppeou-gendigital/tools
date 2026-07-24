import { useMemo, useState } from 'react'
import { ArrowLeft, Book, FileText } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useLockbox } from '@/providers/LockboxProvider'
import { useOffline } from '@/providers/OfflineProvider'
import { useRevealedNotePreviews } from '@/hooks/useRevealedNotePreviews'
import { notesInNotebook } from '@/lib/workspaceModel'
import { bodyToPreviewText } from '@/lib/noteBody'
import { OfflineBanner } from './OfflineBanner'
import styles from './Offline.module.scss'

function formatUpdated(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function OfflineHome() {
  const { primaryPack } = useOffline()
  const { navigate } = useNavigation()
  const {
    notebooks,
    activeNotebook,
    activeNotebookId,
    setActiveNotebookId,
    setActiveNoteId,
    workspace,
    ready,
  } = useNotes()
  const {
    noteIsLocked,
    isUnlocked,
    unlockedIds,
    revealNoteContent,
    requestUnlock,
  } = useLockbox()
  const [viewingNotes, setViewingNotes] = useState(false)

  const notes = useMemo(() => {
    if (!activeNotebookId) return []
    return notesInNotebook(workspace, activeNotebookId)
  }, [workspace, activeNotebookId])

  const revealed = useRevealedNotePreviews(workspace, notes, {
    isUnlocked,
    unlockedIds,
    revealNoteContent,
  })

  if (!viewingNotes || !activeNotebook) {
    return (
      <div className={styles.page}>
        <PageHeader title="Notas" subtitle="Offline notebooks" />
        <div className={styles.body}>
          <OfflineBanner syncedAt={primaryPack?.syncedAt} />
          {!ready ? (
            <p className={styles.loading}>Loading…</p>
          ) : notebooks.length === 0 ? (
            <p className={styles.hint}>No notebooks in this offline copy.</p>
          ) : (
            <ul className={styles.list}>
              {notebooks.map((nb) => {
                const count = notesInNotebook(workspace, nb.id).length
                return (
                  <li key={nb.id}>
                    <button
                      type="button"
                      className={styles.row}
                      onClick={() => {
                        setActiveNotebookId(nb.id)
                        setViewingNotes(true)
                      }}
                    >
                      <span className={styles.rowIcon} aria-hidden="true">
                        <Book size={18} />
                      </span>
                      <span className={styles.rowBody}>
                        <span className={styles.rowTitle}>{nb.name}</span>
                        <span className={styles.rowMeta}>
                          {count} note{count === 1 ? '' : 's'}
                          {nb.lockboxId ? ' · protected' : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={activeNotebook.name}
        subtitle={`${notes.length} note${notes.length === 1 ? '' : 's'}`}
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingNotes(false)}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Notebooks
          </Button>
        }
      />
      <div className={styles.body}>
        <OfflineBanner syncedAt={primaryPack?.syncedAt} />
        {notes.length === 0 ? (
          <p className={styles.hint}>No notes in this notebook.</p>
        ) : (
          <ul className={styles.list}>
            {notes.map((note) => {
              const locked = noteIsLocked(note)
              const preview = revealed[note.id]
              const title = locked
                ? 'Locked note'
                : preview?.title || note.title || 'Untitled'
              const body = locked
                ? 'Protected — unlock to read'
                : preview
                  ? bodyToPreviewText(preview.body)
                  : note.ciphertext
                    ? 'Decrypting…'
                    : bodyToPreviewText(note.body)
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    className={styles.row}
                    onClick={async () => {
                      if (locked) {
                        const lbId =
                          note.lockboxId || activeNotebook.lockboxId || null
                        if (lbId && !isUnlocked(lbId)) {
                          try {
                            await requestUnlock(lbId)
                          } catch {
                            return
                          }
                        }
                      }
                      setActiveNoteId(note.id)
                      navigate('note-edit')
                    }}
                  >
                    <span className={styles.rowIcon} aria-hidden="true">
                      <FileText size={18} />
                    </span>
                    <span className={styles.rowBody}>
                      <span className={styles.rowTitle}>{title}</span>
                      <span className={styles.rowMeta}>
                        {body || 'No content'}
                        {note.updatedAt
                          ? ` · ${formatUpdated(note.updatedAt)}`
                          : ''}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
