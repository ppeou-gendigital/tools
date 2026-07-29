import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/molecules/Button'
import {
  openAttachmentBlob,
  previewKind,
} from '@/lib/attachmentsApi'
import styles from './FilePreview.module.scss'

const FilePreviewContext = createContext(null)

export function FilePreviewProvider({ children }) {
  const revokeRef = useRef(null)
  const [preview, setPreview] = useState(null)
  // preview: null | { status: 'loading'|'ready'|'error', fileName, kind?, url?, message? }

  const clearRevoke = useCallback(() => {
    revokeRef.current?.()
    revokeRef.current = null
  }, [])

  const closePreview = useCallback(() => {
    clearRevoke()
    setPreview(null)
  }, [clearRevoke])

  const previewAttachment = useCallback(
    async (attachment) => {
      const fileName = attachment?.fileName || 'attachment'
      const kind = previewKind(attachment?.mimeType, attachment?.fileName)
      if (!kind) {
        setPreview({
          status: 'error',
          fileName,
          message: 'Preview is not available for this file type.',
        })
        return
      }

      clearRevoke()
      setPreview({ status: 'loading', fileName, kind })

      try {
        const handle = await openAttachmentBlob(attachment)
        revokeRef.current = handle.revoke
        setPreview({
          status: 'ready',
          fileName,
          kind,
          url: handle.url,
        })
      } catch (err) {
        clearRevoke()
        setPreview({
          status: 'error',
          fileName,
          kind,
          message: err?.message || 'Could not load file.',
        })
      }
    },
    [clearRevoke],
  )

  useEffect(() => {
    return () => clearRevoke()
  }, [clearRevoke])

  useEffect(() => {
    if (!preview) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        closePreview()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [preview, closePreview])

  const value = useMemo(
    () => ({
      previewAttachment,
      closePreview,
      isOpen: !!preview,
    }),
    [previewAttachment, closePreview, preview],
  )

  return (
    <FilePreviewContext.Provider value={value}>
      {children}
      {preview && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={styles.backdrop}
              data-file-preview=""
              role="presentation"
              onClick={closePreview}
            >
              <div
                className={styles.panel}
                role="dialog"
                aria-modal="true"
                aria-label={`Preview ${preview.fileName}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.header}>
                  <p className={styles.title}>{preview.fileName}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={styles.close}
                    onClick={closePreview}
                    aria-label="Close preview"
                  >
                    <X size={14} aria-hidden="true" />
                  </Button>
                </div>
                <div className={styles.body}>
                  {preview.status === 'loading' ? (
                    <p className={styles.loading}>
                      <Loader2
                        size={18}
                        className={styles.spin}
                        aria-hidden="true"
                      />{' '}
                      Loading…
                    </p>
                  ) : null}
                  {preview.status === 'error' ? (
                    <p className={styles.error} role="alert">
                      {preview.message || 'Could not preview file.'}
                    </p>
                  ) : null}
                  {preview.status === 'ready' && preview.kind === 'image' ? (
                    <img
                      src={preview.url}
                      alt={preview.fileName}
                      className={styles.img}
                    />
                  ) : null}
                  {preview.status === 'ready' && preview.kind === 'pdf' ? (
                    <iframe
                      title={preview.fileName}
                      src={preview.url}
                      className={styles.frame}
                    />
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </FilePreviewContext.Provider>
  )
}

export function useFilePreview() {
  const ctx = useContext(FilePreviewContext)
  if (!ctx) {
    throw new Error('useFilePreview must be used inside <FilePreviewProvider>')
  }
  return ctx
}
