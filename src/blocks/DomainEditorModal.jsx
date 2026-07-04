import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { DomainEditor, isDraftValid, toPersisted } from '@/blocks/DomainEditor'
import styles from './DomainEditorModal.module.scss'

const MODE_TITLES = {
  add: 'Add environment',
  edit: 'Edit environment',
  clone: 'Duplicate environment',
}

// Cheap stable stringification for dirty-check. Fields are all primitive
// (strings) so JSON.stringify with sorted keys is deterministic enough.
function fingerprint(draft) {
  if (!draft) return ''
  const keys = Object.keys(draft).sort()
  const out = {}
  for (const k of keys) out[k] = draft[k]
  return JSON.stringify(out)
}

// Modal shell used by the AEM Environments page to add / edit / clone a
// domain. Owns the draft state internally so the parent only sees the
// final result on Save; Cancel simply discards. Dirty edits prompt a
// confirm on ESC or backdrop click so accidental clicks don't wipe
// half-typed configs.
//
// Props:
//   - mode:        'add' | 'edit' | 'clone'
//   - initial:     the draft to seed the form with
//   - onSave:      (persisted) => void   receives the toPersisted() result
//   - onClose:     () => void            called after any successful close
export function DomainEditorModal({ mode, initial, onSave, onClose }) {
  const [draft, setDraft] = useState(initial)
  const initialFingerprint = useRef(fingerprint(initial))

  // Reset local draft when the parent hands us a different initial. This
  // covers rapid edit -> edit-different-row transitions without a full
  // unmount / remount.
  useEffect(() => {
    setDraft(initial)
    initialFingerprint.current = fingerprint(initial)
  }, [initial])

  const isDirty = useMemo(
    () => fingerprint(draft) !== initialFingerprint.current,
    [draft],
  )

  const canSave = isDraftValid(draft)

  const requestClose = useCallback(() => {
    if (isDirty) {
      const ok = window.confirm('Discard unsaved changes?')
      if (!ok) return
    }
    onClose?.()
  }, [isDirty, onClose])

  // ESC = requestClose. Bound to window so it works regardless of focus.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  // Lock body scroll while the modal is up. The popup surface itself
  // doesn't scroll (it's a fixed 780x600 shell) but any inner scroll
  // regions on the page underneath shouldn't move while the modal is
  // interactive.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) requestClose()
  }

  function handlePatch(patch) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function handleSave() {
    if (!canSave) return
    onSave?.(toPersisted(draft))
    onClose?.()
  }

  const title = MODE_TITLES[mode] ?? 'Environment'

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="domain-editor-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="domain-editor-title" className={styles.title}>
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={requestClose}
            className={styles.closeBtn}
            aria-label="Close"
            title="Close"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </header>

        <div className={styles.body}>
          <DomainEditor
            draft={draft}
            onChange={handlePatch}
            labelAutoFocus
          />
        </div>

        <footer className={styles.footer}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={requestClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
            title={canSave ? undefined : 'Fill required fields to save'}
          >
            Save
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
