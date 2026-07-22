// TipTap document helpers for rich-text fields (text only — no inline files).
// After `npm run init -- --name foo`, format becomes `foo-tiptap-v1`.

import { generateText } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

export const RICH_BODY_FORMAT = 'toolname-tiptap-v1'

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
export function parseRichBody(raw) {
  if (raw == null || raw === '') {
    return { format: RICH_BODY_FORMAT, doc: emptyDoc() }
  }
  if (typeof raw !== 'string') {
    return { format: RICH_BODY_FORMAT, doc: emptyDoc() }
  }
  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (
        parsed &&
        typeof parsed.format === 'string' &&
        parsed.format.endsWith('-tiptap-v1') &&
        parsed.doc &&
        typeof parsed.doc === 'object'
      ) {
        return { format: parsed.format, doc: parsed.doc }
      }
      if (parsed?.type === 'doc') {
        return { format: RICH_BODY_FORMAT, doc: parsed }
      }
    } catch {
      // fall through
    }
  }
  return { format: RICH_BODY_FORMAT, doc: plainToDoc(raw) }
}

export function serializeRichBody(doc) {
  return JSON.stringify({
    format: RICH_BODY_FORMAT,
    doc: doc && typeof doc === 'object' ? doc : emptyDoc(),
  })
}

export function bodyToPreviewText(raw, maxLen = 100) {
  const { doc } = parseRichBody(raw)
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

export function isRichBodyEmpty(raw) {
  return !bodyToPreviewText(raw, 10_000)
}

// Aliases used by RichNoteEditor (same names as notas noteBody helpers).
export const parseNoteBody = parseRichBody
export const serializeNoteBody = serializeRichBody
