// TipTap document helpers for note.body (text RTE only — no inline files).

import { generateText } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

export const NOTE_BODY_FORMAT = 'notas-tiptap-v1'

const PREVIEW_EXTENSIONS = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: false }),
]

export function emptyDoc() {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

export function plainToDoc(text) {
  const value = String(text ?? '')
  if (!value) return emptyDoc()
  const lines = value.split(/\n/)
  return {
    type: 'doc',
    content: lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    })),
  }
}

/**
 * @returns {{ format: string, doc: object }}
 */
export function parseNoteBody(raw) {
  if (raw == null || raw === '') {
    return { format: NOTE_BODY_FORMAT, doc: emptyDoc() }
  }
  if (typeof raw !== 'string') {
    return { format: NOTE_BODY_FORMAT, doc: emptyDoc() }
  }
  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (
        parsed &&
        parsed.format === NOTE_BODY_FORMAT &&
        parsed.doc &&
        typeof parsed.doc === 'object'
      ) {
        return { format: NOTE_BODY_FORMAT, doc: parsed.doc }
      }
      // TipTap JSON saved without wrapper
      if (parsed?.type === 'doc') {
        return { format: NOTE_BODY_FORMAT, doc: parsed }
      }
    } catch {
      // fall through to plain text
    }
  }
  return { format: NOTE_BODY_FORMAT, doc: plainToDoc(raw) }
}

export function serializeNoteBody(doc) {
  return JSON.stringify({
    format: NOTE_BODY_FORMAT,
    doc: doc && typeof doc === 'object' ? doc : emptyDoc(),
  })
}

export function bodyToPreviewText(raw, maxLen = 100) {
  const { doc } = parseNoteBody(raw)
  let text = ''
  try {
    text = generateText(doc, PREVIEW_EXTENSIONS)
  } catch {
    text = ''
  }
  text = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return ''
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text
}

export function isNoteBodyEmpty(raw) {
  return !bodyToPreviewText(raw, 10_000)
}
