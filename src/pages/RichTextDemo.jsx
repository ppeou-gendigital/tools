import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Eye,
  FileIcon,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Label } from '@/molecules/Label'
import { RichNoteEditor } from '@/molecules/RichNoteEditor'
import { Modal } from '@/patterns/Modal'
import { PageHeader } from '@/patterns/PageHeader'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useNavigation } from '@/providers/NavigationProvider'
import { asyncStorage } from '@/lib/storage'
import {
  bodyToPreviewText,
  serializeRichBody,
  emptyDoc,
} from '@/lib/richBody'
import { formatByteSize } from '@/lib/attachmentsApi'
import styles from './RichTextDemo.module.scss'

const STORAGE_KEY = 'toolname.richTextDemo.body'

function previewKind(mimeType, fileName = '') {
  const mime = String(mimeType || '').toLowerCase()
  const name = String(fileName || '').toLowerCase()
  if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) {
    return 'image'
  }
  if (mime.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(name)) {
    return 'video'
  }
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (
    mime.startsWith('text/') ||
    /\.(txt|md|csv|json)$/.test(name)
  ) {
    return 'text'
  }
  return null
}

/**
 * Demo: TipTap RTE + local multi-file pick/paste/drop (preview only).
 * Wire [`attachmentsApi`](src/lib/attachmentsApi.js) + SQL when you have
 * a parent domain table — see tool/notas NoteEdit for the full pattern.
 */
export function RichTextDemo() {
  const { goBack, previousRouteLabel } = useNavigation()
  const [body, setBody] = useState(() => serializeRichBody(emptyDoc()))
  const [ready, setReady] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const previewUrlRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (cancelled) return
      if (raw) setBody(raw)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    void asyncStorage.setItem(STORAGE_KEY, body)
  }, [body, ready])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreview(null)
  }

  function handleFiles(files) {
    if (!files?.length) return
    setError(null)
    setPendingFiles((prev) => [...prev, ...files])
  }

  function handleFileInputChange(e) {
    const list = e.target.files
    if (!list?.length) return
    handleFiles([...list])
    e.target.value = ''
  }

  async function handlePreview(file) {
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
    if (kind === 'text') text = await file.text()
    setPreview({ fileName: file.name, kind, url, text })
  }

  const previewText = bodyToPreviewText(body)

  return (
    <div className={styles.page}>
      <PageHeader
        title="Rich text demo"
        subtitle="TipTap RTE + multi-file attach (local demo)"
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
          <PageShortcuts current="rich-text-demo" className={styles.iconBtn} />
        }
      />

      <div className={styles.body}>
        <p className={styles.lead}>
          Formatting is stored as JSON (<code>toolname-tiptap-v1</code>).
          Pasted or dropped files stay out of the document — use Upload or
          paste/drop, then wire{' '}
          <code>attachmentsApi</code> to Supabase Storage for persistence
          (see <code>tool/notas</code>).
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <Label htmlFor="rich-demo-body">Rich text</Label>
          <RichNoteEditor
            id="rich-demo-body"
            value={body}
            onChange={setBody}
            onFiles={handleFiles}
            placeholder="Write something… Drop or paste files to attach."
          />
          {previewText ? (
            <p className={styles.hint}>Preview: {previewText}</p>
          ) : (
            <p className={styles.hint}>Preview: (empty)</p>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.attachHeader}>
            <Label id="rich-demo-files">Attachments (local only)</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className={styles.fileInput}
              onChange={handleFileInputChange}
              tabIndex={-1}
              aria-hidden="true"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} aria-hidden="true" />
              Upload
            </Button>
          </div>
          {pendingFiles.length === 0 ? (
            <p className={styles.hint}>No files yet.</p>
          ) : (
            <ul className={styles.attachList} aria-labelledby="rich-demo-files">
              {pendingFiles.map((file, idx) => {
                const canPreview = Boolean(previewKind(file.type, file.name))
                return (
                  <li key={`${idx}-${file.name}`} className={styles.attachRow}>
                    <FileIcon size={14} aria-hidden="true" />
                    <span className={styles.attachName}>{file.name}</span>
                    <span className={styles.attachMeta}>
                      {formatByteSize(file.size)}
                    </span>
                    {canPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(file)}
                        title="Preview"
                        aria-label={`Preview ${file.name}`}
                      >
                        <Eye size={14} />
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
                      title="Remove"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(preview)}
        onDismiss={clearPreview}
        title={preview?.fileName || 'Preview'}
        className={styles.previewModal}
      >
        {preview?.kind === 'image' && (
          <img
            src={preview.url}
            alt={preview.fileName}
            className={styles.previewMedia}
          />
        )}
        {preview?.kind === 'video' && (
          <video src={preview.url} controls className={styles.previewMedia} />
        )}
        {preview?.kind === 'pdf' && (
          <iframe
            title={preview.fileName}
            src={preview.url}
            className={styles.previewFrame}
          />
        )}
        {preview?.kind === 'text' && (
          <pre className={styles.previewText}>{preview.text}</pre>
        )}
        {preview && (
          <Button variant="ghost" size="sm" onClick={clearPreview}>
            <X size={14} /> Close
          </Button>
        )}
      </Modal>
    </div>
  )
}
