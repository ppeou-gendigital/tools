import { useEffect, useRef, useState } from 'react'
import {
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  Loader2,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import {
  canPreviewAttachment,
  formatByteSize,
  openAttachmentBlob,
  saveAttachmentDownload,
} from '@/lib/attachmentsApi'
import { useFilePreview } from '@/providers/FilePreviewProvider'
import { cx } from '@/lib/cx'
import styles from './AttachmentCard.module.scss'

/**
 * Attachment list row with ellipsis menu: open / preview / download.
 *
 * @param {object} props
 * @param {object} props.attachment
 * @param {string} [props.meta] — secondary line under filename (defaults to size)
 * @param {() => void} [props.onOpen] — body click (e.g. go to edit)
 * @param {string} [props.className]
 */
export function AttachmentCard({
  attachment,
  meta,
  onOpen,
  className,
}) {
  const { previewAttachment } = useFilePreview()
  const menuBtnRef = useRef(null)
  const blobRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const fileName = attachment?.fileName || 'attachment'
  const sizeLabel = formatByteSize(attachment?.byteSize)
  const metaLine = meta ?? sizeLabel
  const previewable = canPreviewAttachment(attachment)

  useEffect(() => {
    return () => {
      blobRef.current?.revoke?.()
      blobRef.current = null
    }
  }, [])

  function clearBlob() {
    blobRef.current?.revoke?.()
    blobRef.current = null
  }

  async function handleOpenInNewTab() {
    setMenuOpen(false)
    setError('')
    // Open synchronously while we still have the user-gesture; async
    // downloads after await are treated as pop-ups and get blocked.
    const win = window.open('about:blank', '_blank')
    if (!win) {
      setError('Pop-up blocked. Allow pop-ups to open the file.')
      return
    }
    try {
      win.document.title = fileName
      win.document.body.innerHTML =
        '<p style="font:14px sans-serif;padding:1rem;color:#666">Loading…</p>'
    } catch {
      // Cross-origin about:blank writes can fail; navigation still works.
    }
    setBusy(true)
    try {
      clearBlob()
      const handle = await openAttachmentBlob(attachment)
      blobRef.current = handle
      win.location.href = handle.url
      // Keep URL alive briefly for the new tab; revoke later.
      setTimeout(() => {
        if (blobRef.current?.url === handle.url) clearBlob()
      }, 60_000)
    } catch (err) {
      try {
        win.close()
      } catch {
        /* ignore */
      }
      setError(err?.message || 'Could not load file.')
      clearBlob()
    } finally {
      setBusy(false)
    }
  }

  function handlePreview() {
    setMenuOpen(false)
    setError('')
    void previewAttachment(attachment)
  }

  async function handleDownload() {
    setMenuOpen(false)
    setError('')
    setBusy(true)
    try {
      await saveAttachmentDownload(attachment)
    } catch (err) {
      setError(err?.message || 'Could not download file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.card}>
        <button
          type="button"
          className={styles.body}
          onClick={onOpen}
          disabled={!onOpen}
        >
          <span className={styles.title}>{fileName}</span>
          <span className={styles.meta}>{metaLine}</span>
        </button>

        <button
          ref={menuBtnRef}
          type="button"
          className={styles.menuBtn}
          aria-label={`Actions for ${fileName}`}
          title="Actions"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
        >
          {busy ? (
            <Loader2 size={16} className={styles.spin} aria-hidden="true" />
          ) : (
            <EllipsisVertical size={16} aria-hidden="true" />
          )}
        </button>

        <AnchoredPopover
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchorRef={menuBtnRef}
          align="end"
          fluid
          role="menu"
          aria-label={`Actions for ${fileName}`}
        >
          <ul className={styles.menu}>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                disabled={busy}
                onClick={handleOpenInNewTab}
              >
                <ExternalLink size={16} aria-hidden="true" />
                <span>Open in new tab</span>
              </button>
            </li>
            {previewable && (
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  disabled={busy}
                  onClick={handlePreview}
                >
                  <Eye size={16} aria-hidden="true" />
                  <span>Preview</span>
                </button>
              </li>
            )}
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                disabled={busy}
                onClick={handleDownload}
              >
                <Download size={16} aria-hidden="true" />
                <span>Download</span>
              </button>
            </li>
          </ul>
        </AnchoredPopover>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
