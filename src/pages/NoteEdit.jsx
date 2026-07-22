import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Download,
  Eye,
  FileIcon,
  Lock,
  Paperclip,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { LockboxSessionToggle } from '@/molecules/LockboxSessionToggle'
import { RichNoteEditor } from '@/molecules/RichNoteEditor'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { useNavigation } from '@/providers/NavigationProvider'
import { useNotes } from '@/providers/NotesProvider'
import { useLockbox } from '@/providers/LockboxProvider'
import { useAuth } from '@/providers/AuthProvider'
import {
  effectiveLockboxId,
  notebookIdsForNote,
  normalizeTagName,
} from '@/lib/workspaceModel'
import { serializeNoteBody, parseNoteBody } from '@/lib/noteBody'
import {
  deleteAttachment,
  deleteAttachmentsForNote,
  downloadAttachment,
  formatByteSize,
  listAttachments,
  uploadAttachment,
} from '@/lib/attachmentsApi'
import styles from './NoteEdit.module.scss'

function inheritedLockboxId(notebooks, notebookIds) {
  const memberLbs = [...notebookIds]
    .map((id) => notebooks.find((n) => n.id === id)?.lockboxId)
    .filter(Boolean)
  if (memberLbs.length === 0) return null
  if (new Set(memberLbs).size !== 1) return null
  return memberLbs[0]
}

function previewKind(mimeType, fileName = '') {
  const mime = String(mimeType || '').toLowerCase()
  const name = String(fileName || '').toLowerCase()
  if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/.test(name)) {
    return 'image'
  }
  if (mime.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/.test(name)) {
    return 'video'
  }
  if (mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/.test(name)) {
    return 'audio'
  }
  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    return 'pdf'
  }
  if (
    mime.startsWith('text/') ||
    mime === 'application/json' ||
    /\.(txt|md|csv|json|log|xml|html?)$/.test(name)
  ) {
    return 'text'
  }
  return null
}

function NoteEditForm({
  noteId,
  initialTitle,
  initialBody,
  initialNotebookIds,
  initialTagNames,
  initialLockboxId,
  onSaved,
  onDeleted,
  onBack,
  backLabel,
}) {
  const { notebooks, lockboxes, deleteNote, setNoteTags } = useNotes()
  const {
    saveNoteContent,
    attachLockboxToNote,
    requestUnlock,
    isUnlocked,
    encryptBytes,
    decryptBytes,
  } = useLockbox()
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(() => {
    const parsed = parseNoteBody(initialBody)
    return serializeNoteBody(parsed.doc)
  })
  const [selectedNotebookIds, setSelectedNotebookIds] = useState(
    () => new Set(initialNotebookIds),
  )
  const [tags, setTags] = useState(() => [...initialTagNames])
  const [tagDraft, setTagDraft] = useState('')
  const [lockboxId, setLockboxId] = useState(initialLockboxId ?? '')
  const [saving, setSaving] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [pendingFiles, setPendingFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const previewUrlRef = useRef(null)
  const isNew = !noteId
  const sessionLockboxId =
    lockboxId || inheritedLockboxId(notebooks, selectedNotebookIds)

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreview(null)
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      if (!userId || !noteId) {
        setAttachments([])
        return
      }
      try {
        const rows = await listAttachments(userId, noteId)
        if (!cancelled) setAttachments(rows)
      } catch (err) {
        if (!cancelled) {
          console.warn('[notas] list attachments failed', err?.message ?? err)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId, noteId])

  async function ensureLockboxForFiles(lbId) {
    if (!lbId) return
    if (!isUnlocked(lbId)) await requestUnlock(lbId)
  }

  async function uploadFilesToNote(targetNoteId, files, lbId) {
    if (!userId || !targetNoteId || !files?.length) return
    await ensureLockboxForFiles(lbId)
    setUploading(true)
    try {
      for (const file of files) {
        const row = await uploadAttachment({
          userId,
          noteId: targetNoteId,
          file,
          lockboxId: lbId || null,
          encryptBytes: lbId ? encryptBytes : undefined,
        })
        setAttachments((prev) => [...prev, row])
      }
    } finally {
      setUploading(false)
    }
  }

  async function handleFiles(files) {
    if (!files?.length) return
    setError(null)
    try {
      if (!noteId) {
        setPendingFiles((prev) => [...prev, ...files])
        return
      }
      await uploadFilesToNote(noteId, files, sessionLockboxId)
    } catch (err) {
      setError(err?.message ?? String(err))
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileInputChange(e) {
    const list = e.target.files
    if (!list?.length) return
    const files = [...list]
    e.target.value = ''
    void handleFiles(files)
  }

  async function loadAttachmentBlob(att) {
    const lbId = att.iv ? sessionLockboxId : null
    if (lbId) await ensureLockboxForFiles(lbId)
    return downloadAttachment({
      attachment: att,
      lockboxId: lbId,
      decryptBytes: lbId ? decryptBytes : undefined,
    })
  }

  async function handleDownloadAttachment(att) {
    setError(null)
    try {
      const blob = await loadAttachmentBlob(att)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = att.fileName || 'download'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.message ?? String(err))
    }
  }

  async function handlePreviewAttachment(att) {
    const kind = previewKind(att.mimeType, att.fileName)
    if (!kind) {
      setError('Preview is not available for this file type. Download instead.')
      return
    }
    setError(null)
    setPreview({
      fileName: att.fileName,
      mimeType: att.mimeType,
      kind,
      url: null,
      text: null,
      loading: true,
    })
    try {
      const blob = await loadAttachmentBlob(att)
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      const url = URL.createObjectURL(blob)
      previewUrlRef.current = url
      let text = null
      if (kind === 'text') {
        text = await blob.text()
      }
      setPreview({
        fileName: att.fileName,
        mimeType: att.mimeType,
        kind,
        url,
        text,
        loading: false,
      })
    } catch (err) {
      clearPreview()
      setError(err?.message ?? String(err))
    }
  }

  async function handlePreviewPendingFile(file) {
    const kind = previewKind(file.type, file.name)
    if (!kind) {
      setError('Preview is not available for this file type.')
      return
    }
    setError(null)
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    let text = null
    if (kind === 'text') {
      text = await file.text()
    }
    setPreview({
      fileName: file.name,
      mimeType: file.type,
      kind,
      url,
      text,
      loading: false,
    })
  }

  async function handleRemoveAttachment(att) {
    if (!userId) return
    setError(null)
    try {
      await deleteAttachment(userId, att)
      setAttachments((prev) => prev.filter((a) => a.id !== att.id))
    } catch (err) {
      setError(err?.message ?? String(err))
    }
  }

  function toggleNotebook(id) {
    setSelectedNotebookIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size <= 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function addTagFromDraft() {
    const name = normalizeTagName(tagDraft)
    if (!name) {
      setTagDraft('')
      return
    }
    setTags((prev) => {
      if (prev.some((t) => t.toLowerCase() === name.toLowerCase())) return prev
      return [...prev, name]
    })
    setTagDraft('')
  }

  function removeTag(name) {
    setTags((prev) => prev.filter((t) => t !== name))
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTagFromDraft()
      return
    }
    if (e.key === 'Backspace' && !tagDraft && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  async function handleSave() {
    if (saving) return
    if (selectedNotebookIds.size === 0) {
      setError('Select at least one notebook.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const nextLb = lockboxId || null
      if (nextLb && !isUnlocked(nextLb)) {
        await requestUnlock(nextLb)
      }
      const pending = normalizeTagName(tagDraft)
      const tagNames = pending
        ? [
            ...tags,
            ...(tags.some((t) => t.toLowerCase() === pending.toLowerCase())
              ? []
              : [pending]),
          ]
        : tags
      const note = await saveNoteContent(noteId, {
        title,
        body,
        notebookIds: [...selectedNotebookIds],
        lockboxId: nextLb,
      })
      const id = note?.id ?? noteId
      if (id) {
        await setNoteTags(id, tagNames)
        if (pendingFiles.length > 0) {
          const lbForFiles =
            nextLb || inheritedLockboxId(notebooks, selectedNotebookIds)
          await uploadFilesToNote(id, pendingFiles, lbForFiles)
          setPendingFiles([])
        }
      }
      onSaved(id)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!noteId || saving) return
    setSaving(true)
    try {
      if (userId) {
        try {
          await deleteAttachmentsForNote(userId, noteId)
        } catch (err) {
          console.warn('[notas] attachment cleanup failed', err?.message ?? err)
        }
      }
      await deleteNote(noteId)
      onDeleted()
    } finally {
      setSaving(false)
    }
  }

  async function handleLockboxChange(next) {
    setLockboxId(next)
    if (!noteId) return
    if (!next) {
      try {
        await attachLockboxToNote(noteId, null)
      } catch (err) {
        setError(err?.message ?? String(err))
      }
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={isNew ? 'New note' : 'Edit note'}
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className={styles.back}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {backLabel}
          </Button>
        }
        actions={
          sessionLockboxId ? (
            <LockboxSessionToggle
              lockboxId={sessionLockboxId}
              label="note"
              className={styles.sessionToggle}
            />
          ) : null
        }
      />

      <div className={styles.body}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <Label htmlFor="note-title">Title</Label>
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor="note-body">Note</Label>
          <RichNoteEditor
            id="note-body"
            value={body}
            onChange={setBody}
            onFiles={handleFiles}
            placeholder="Write something… Drop or paste files to attach."
            disabled={saving}
            className={styles.bodyInput}
          />
          <p className={styles.hint}>
            Formatting stays in the note. Pasted or dropped files upload as
            attachments (max 25 MB each).
          </p>
        </div>

        <div className={styles.field}>
          <div className={styles.attachHeader}>
            <Label id="note-attachments-label">
              <Paperclip size={12} aria-hidden="true" /> Attachments
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className={styles.fileInput}
              onChange={handleFileInputChange}
              disabled={saving || uploading}
              aria-hidden="true"
              tabIndex={-1}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={saving || uploading}
              aria-label="Upload files"
              title="Upload files"
            >
              <Upload size={14} aria-hidden="true" />
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
          {(attachments.length === 0 && pendingFiles.length === 0) ? (
            <p className={styles.hint}>
              No attachments yet. Upload multiple files, or paste / drop them
              into the note.
            </p>
          ) : (
            <ul
              className={styles.attachList}
              aria-labelledby="note-attachments-label"
            >
              {attachments.map((att) => {
                const canPreview = Boolean(
                  previewKind(att.mimeType, att.fileName),
                )
                return (
                  <li key={att.id} className={styles.attachRow}>
                    <FileIcon size={14} aria-hidden="true" />
                    <span className={styles.attachName}>{att.fileName}</span>
                    <span className={styles.attachMeta}>
                      {formatByteSize(att.byteSize)}
                      {att.iv ? ' · encrypted' : ''}
                    </span>
                    {canPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewAttachment(att)}
                        disabled={saving || uploading}
                        aria-label={`Preview ${att.fileName}`}
                        title="Preview"
                      >
                        <Eye size={14} aria-hidden="true" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadAttachment(att)}
                      disabled={saving || uploading}
                      aria-label={`Download ${att.fileName}`}
                      title="Download"
                    >
                      <Download size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(att)}
                      disabled={saving || uploading}
                      aria-label={`Remove ${att.fileName}`}
                      title="Remove"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </Button>
                  </li>
                )
              })}
              {pendingFiles.map((file, idx) => {
                const canPreview = Boolean(previewKind(file.type, file.name))
                return (
                  <li
                    key={`pending-${idx}-${file.name}`}
                    className={styles.attachRow}
                  >
                    <FileIcon size={14} aria-hidden="true" />
                    <span className={styles.attachName}>{file.name}</span>
                    <span className={styles.attachMeta}>
                      {formatByteSize(file.size)} · pending save
                    </span>
                    {canPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewPendingFile(file)}
                        disabled={saving || uploading}
                        aria-label={`Preview ${file.name}`}
                        title="Preview"
                      >
                        <Eye size={14} aria-hidden="true" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPendingFiles((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      disabled={saving || uploading}
                      aria-label={`Remove ${file.name}`}
                      title="Remove"
                    >
                      <X size={14} aria-hidden="true" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
          {uploading && <p className={styles.hint}>Uploading…</p>}
        </div>

        <Modal
          open={Boolean(preview)}
          onDismiss={clearPreview}
          title={preview?.fileName || 'Preview'}
          className={styles.previewModal}
        >
          {preview?.loading && (
            <p className={styles.hint}>Loading preview…</p>
          )}
          {preview && !preview.loading && preview.kind === 'image' && (
            <img
              src={preview.url}
              alt={preview.fileName}
              className={styles.previewMedia}
            />
          )}
          {preview && !preview.loading && preview.kind === 'video' && (
            <video
              src={preview.url}
              controls
              className={styles.previewMedia}
            />
          )}
          {preview && !preview.loading && preview.kind === 'audio' && (
            <audio src={preview.url} controls className={styles.previewAudio} />
          )}
          {preview && !preview.loading && preview.kind === 'pdf' && (
            <iframe
              title={preview.fileName}
              src={preview.url}
              className={styles.previewFrame}
            />
          )}
          {preview && !preview.loading && preview.kind === 'text' && (
            <pre className={styles.previewText}>{preview.text}</pre>
          )}
        </Modal>

        <div className={styles.field}>
          <Label id="note-notebooks-label">Notebooks</Label>
          <div
            className={styles.chipGroup}
            role="group"
            aria-labelledby="note-notebooks-label"
          >
            {notebooks.map((nb) => {
              const selected = selectedNotebookIds.has(nb.id)
              return (
                <button
                  key={nb.id}
                  type="button"
                  className={styles.chip}
                  data-selected={selected ? 'true' : 'false'}
                  aria-pressed={selected}
                  onClick={() => toggleNotebook(nb.id)}
                  disabled={saving}
                >
                  {nb.name}
                </button>
              )
            })}
          </div>
          <p className={styles.hint}>Select one or more notebooks.</p>
        </div>

        <div className={styles.field}>
          <Label htmlFor="note-tags">Tags</Label>
          <div className={styles.tagEditor}>
            {tags.map((name) => (
              <span key={name} className={styles.tagChip}>
                {name}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => removeTag(name)}
                  disabled={saving}
                  aria-label={`Remove tag ${name}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
            <Input
              id="note-tags"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTagFromDraft}
              placeholder={tags.length ? 'Add tag…' : 'work, ideas…'}
              className={styles.tagInput}
              disabled={saving}
            />
          </div>
          <p className={styles.hint}>Press Enter or comma to add a tag.</p>
        </div>

        <div className={styles.field}>
          <Label htmlFor="note-lockbox">
            <Lock size={12} aria-hidden="true" /> Protection
          </Label>
          <select
            id="note-lockbox"
            className={styles.select}
            value={lockboxId}
            onChange={(e) => handleLockboxChange(e.target.value)}
          >
            <option value="">None (or notebook lockbox)</option>
            {lockboxes.map((lb) => (
              <option key={lb.id} value={lb.id}>
                {lb.name}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            Create lockboxes via Lockboxes in the menu. Attachments are
            encrypted when this note (or its notebook) uses a lockbox.
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleSave} disabled={saving} fullWidth>
            {saving ? 'Saving…' : 'Save'}
          </Button>

          {!isNew &&
            (confirmingDelete ? (
              <div className={styles.confirmDelete}>
                <p className={styles.confirmText}>Delete this note?</p>
                <div className={styles.confirmActions}>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setConfirmingDelete(true)}
                disabled={saving}
                fullWidth
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}

export function NoteEdit() {
  const { goBack, previousRouteLabel } = useNavigation()
  const {
    ready,
    activeNoteId,
    getNote,
    getTagsForNote,
    setActiveNoteId,
    activeNotebookId,
    workspace,
  } = useNotes()
  const { revealNoteContent, requestUnlock, isUnlocked } = useLockbox()
  const [content, setContent] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!ready) return
      if (!activeNoteId) {
        setContent({ title: '', body: '', locked: false })
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

  if (!ready || (activeNoteId && content === null && !loadError)) {
    return (
      <div className={styles.page}>
        <PageHeader title="Edit note" />
        <div className={styles.body}>
          <p className={styles.loading}>
            {loadError || 'Loading…'}
          </p>
        </div>
      </div>
    )
  }

  const existing = activeNoteId ? getNote(activeNoteId) : null

  if (activeNoteId && !existing) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Edit note"
          leading={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveNoteId(null)
                goBack()
              }}
              className={styles.back}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {previousRouteLabel ?? 'Notes'}
            </Button>
          }
        />
        <div className={styles.body}>
          <p className={styles.loading}>This note is no longer available.</p>
        </div>
      </div>
    )
  }

  if (loadError && !content) {
    return (
      <div className={styles.page}>
        <PageHeader
          title="Edit note"
          leading={
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className={styles.back}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {previousRouteLabel ?? 'Notes'}
            </Button>
          }
        />
        <div className={styles.body}>
          <p className={styles.error}>{loadError}</p>
        </div>
      </div>
    )
  }

  function finish(id) {
    if (id) setActiveNoteId(id)
    goBack()
  }

  function afterDelete() {
    setActiveNoteId(null)
    goBack()
  }

  const tagNames = existing
    ? getTagsForNote(existing.id).map((t) => t.name)
    : []
  const initialNotebookIds = existing
    ? notebookIdsForNote(workspace, existing.id)
    : activeNotebookId
      ? [activeNotebookId]
      : []

  return (
    <NoteEditForm
      key={activeNoteId ?? 'new'}
      noteId={activeNoteId}
      initialTitle={content?.title ?? ''}
      initialBody={content?.body ?? ''}
      initialNotebookIds={initialNotebookIds}
      initialTagNames={tagNames}
      initialLockboxId={existing?.lockboxId ?? ''}
      onSaved={finish}
      onDeleted={afterDelete}
      onBack={goBack}
      backLabel={previousRouteLabel ?? 'Notes'}
    />
  )
}
