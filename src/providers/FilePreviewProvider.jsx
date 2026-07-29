import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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

const FOCUSABLE =
  'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

export function FilePreviewProvider({ children }) {
  const revokeRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const titleId = useId()
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
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null
    const prevOverflow =
      typeof document !== 'undefined' ? document.body.style.overflow : ''
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
    const focusClose = () => {
      if (closeBtnRef.current instanceof HTMLElement) {
        closeBtnRef.current.focus()
      } else if (panelRef.current instanceof HTMLElement) {
        panelRef.current.focus()
      }
    }
    // Wait a tick so the portal mounts.
    const t = globalThis.setTimeout(focusClose, 0)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        closePreview()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll(FOCUSABLE)
      if (focusables.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !panel.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      globalThis.clearTimeout(t)
      document.removeEventListener('keydown', onKey, true)
      if (typeof document !== 'undefined') {
        document.body.style.overflow = prevOverflow
      }
      const prev = previouslyFocusedRef.current
      if (prev instanceof HTMLElement) prev.focus()
    }
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
                ref={panelRef}
                className={styles.panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.header}>
                  <p id={titleId} className={styles.title}>
                    {preview.fileName}
                  </p>
                  <Button
                    ref={closeBtnRef}
                    type="button"
                    variant="ghost"
                    size="icon"
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
