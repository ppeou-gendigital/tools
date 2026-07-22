import { useEffect, useMemo, useRef, useState } from 'react'
import { effectiveLockboxId } from '@/lib/workspaceModel'

/**
 * Decrypt title/body for notes whose lockbox is currently unlocked,
 * so list UIs can show real previews without opening each note.
 *
 * @param {object} workspace
 * @param {Array} notes
 * @param {{
 *   isUnlocked: (id: string) => boolean,
 *   revealNoteContent: (id: string) => Promise<object|null>,
 *   unlockedIds?: Set<string>,
 * }} lockbox
 * @returns {Record<string, { title: string, body: string }>}
 */
export function useRevealedNotePreviews(
  workspace,
  notes,
  { isUnlocked, revealNoteContent, unlockedIds } = {},
) {
  const [revealed, setRevealed] = useState({})
  const revealRef = useRef(revealNoteContent)
  const isUnlockedRef = useRef(isUnlocked)

  const unlockedKey = useMemo(() => {
    if (unlockedIds && typeof unlockedIds[Symbol.iterator] === 'function') {
      return [...unlockedIds].sort().join(',')
    }
    return notes
      .map((n) => {
        const lb = effectiveLockboxId(workspace, n)
        return lb && isUnlocked?.(lb) ? lb : ''
      })
      .filter(Boolean)
      .sort()
      .join(',')
  }, [unlockedIds, notes, workspace, isUnlocked])

  const noteKey = useMemo(
    () =>
      notes
        .map((n) => `${n.id}:${n.updatedAt}:${n.ciphertext ? '1' : '0'}`)
        .join('|'),
    [notes],
  )

  useEffect(() => {
    revealRef.current = revealNoteContent
    isUnlockedRef.current = isUnlocked
  }, [revealNoteContent, isUnlocked])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const next = {}
      const unlockFn = isUnlockedRef.current
      const revealFn = revealRef.current
      if (typeof unlockFn !== 'function' || typeof revealFn !== 'function') {
        if (!cancelled) setRevealed({})
        return
      }

      await Promise.all(
        notes.map(async (note) => {
          const lbId =
            effectiveLockboxId(workspace, note) || note.lockboxId || null
          if (!lbId || !note.ciphertext || !note.iv) return
          if (!unlockFn(lbId)) return
          try {
            const content = await revealFn(note.id)
            if (cancelled || !content || content.locked) return
            next[note.id] = {
              title: content.title ?? '',
              body: content.body ?? '',
            }
          } catch {
            // Leave locked placeholder if decrypt fails.
          }
        }),
      )
      if (!cancelled) setRevealed(next)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [noteKey, unlockedKey, notes, workspace])

  return revealed
}
