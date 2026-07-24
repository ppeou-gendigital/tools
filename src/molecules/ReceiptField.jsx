import { useEffect, useId, useRef, useState } from 'react'
import { Camera, FileText, Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import { Button } from '@/molecules/Button'
import {
  formatByteSize,
  isImageMime,
} from '@/lib/attachmentsApi'
import { cx } from '@/lib/cx'
import styles from './ReceiptField.module.scss'

/**
 * Receipt picker for expense edit:
 * - Take photo (capture=environment on supporting devices)
 * - Upload image / PDF
 * Shows pending local files + remote attachments.
 */
export function ReceiptField({
  pendingFiles = [],
  onAddFiles,
  onRemovePending,
  attachments = [],
  onRemoveAttachment,
  readOnly = false,
  busy = false,
  className,
}) {
  const labelId = useId()
  const uploadRef = useRef(null)
  const cameraRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function takeFiles(fileList) {
    const files = [...(fileList || [])].filter(Boolean)
    if (files.length) onAddFiles?.(files)
  }

  function openPreview(file) {
    if (!file || !isImageMime(file.type)) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const empty =
    pendingFiles.length === 0 && attachments.length === 0

  return (
    <div className={cx(styles.wrap, className)}>
      <div className={styles.header}>
        <p id={labelId} className={styles.label}>
          Receipts
        </p>
        {!readOnly && (
          <div className={styles.actions}>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className={styles.fileInput}
              tabIndex={-1}
              aria-hidden="true"
              disabled={busy}
              onChange={(e) => {
                takeFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <input
              ref={uploadRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              multiple
              className={styles.fileInput}
              tabIndex={-1}
              aria-hidden="true"
              disabled={busy}
              onChange={(e) => {
                takeFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera size={14} aria-hidden="true" />
              Take photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => uploadRef.current?.click()}
            >
              <Upload size={14} aria-hidden="true" />
              Upload
            </Button>
          </div>
        )}
      </div>

      {empty ? (
        <p className={styles.hint}>
          {readOnly
            ? 'No receipts attached.'
            : 'Add a photo or PDF of the receipt.'}
        </p>
      ) : (
        <ul className={styles.list} aria-labelledby={labelId}>
          {attachments.map((att) => (
            <li key={att.id} className={styles.row}>
              <span className={styles.icon} aria-hidden="true">
                {isImageMime(att.mimeType) ? (
                  <ImageIcon size={14} />
                ) : (
                  <FileText size={14} />
                )}
              </span>
              <span className={styles.name}>{att.fileName}</span>
              <span className={styles.meta}>
                {formatByteSize(att.byteSize)}
              </span>
              {!readOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={styles.removeBtn}
                  disabled={busy}
                  aria-label={`Remove ${att.fileName}`}
                  title="Remove"
                  onClick={() => onRemoveAttachment?.(att)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </Button>
              )}
            </li>
          ))}
          {pendingFiles.map((file, idx) => (
            <li key={`pending-${idx}-${file.name}`} className={styles.row}>
              <span className={styles.icon} aria-hidden="true">
                {isImageMime(file.type) ? (
                  <ImageIcon size={14} />
                ) : (
                  <FileText size={14} />
                )}
              </span>
              <button
                type="button"
                className={styles.nameBtn}
                disabled={!isImageMime(file.type)}
                onClick={() => openPreview(file)}
              >
                {file.name || 'Photo'}
              </button>
              <span className={styles.meta}>
                {formatByteSize(file.size)} · pending
              </span>
              {!readOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={styles.removeBtn}
                  disabled={busy}
                  aria-label={`Remove ${file.name || 'photo'}`}
                  title="Remove"
                  onClick={() => onRemovePending?.(idx)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {previewUrl ? (
        <button
          type="button"
          className={styles.previewBackdrop}
          aria-label="Close preview"
          onClick={() => {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
          }}
        >
          <img src={previewUrl} alt="" className={styles.previewImg} />
        </button>
      ) : null}
    </div>
  )
}
