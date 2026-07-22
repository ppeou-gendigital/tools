import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Heading2,
  Link2,
} from 'lucide-react'
import { cx } from '@/lib/cx'
import {
  parseRichBody,
  serializeRichBody,
  emptyDoc,
} from '@/lib/richBody'
import styles from './RichNoteEditor.module.scss'

function filesFromDataTransfer(dt) {
  if (!dt) return []
  if (dt.files?.length) return [...dt.files]
  const items = dt.items ? [...dt.items] : []
  return items
    .filter((it) => it.kind === 'file')
    .map((it) => it.getAsFile())
    .filter(Boolean)
}

/**
 * TipTap rich-text editor. Text formatting only — paste/drop of files is
 * forwarded via `onFiles` so the parent can upload to Storage.
 */
export function RichNoteEditor({
  id,
  value,
  onChange,
  onFiles,
  placeholder = 'Write something…',
  disabled = false,
  className,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: parseRichBody(value).doc,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange?.(serializeRichBody(ed.getJSON()))
    },
    editorProps: {
      attributes: {
        id: id || undefined,
        class: styles.prose,
      },
      handlePaste(_view, event) {
        const files = filesFromDataTransfer(event.clipboardData)
        if (files.length > 0) {
          event.preventDefault()
          onFiles?.(files)
          return true
        }
        return false
      },
      handleDrop(_view, event) {
        const files = filesFromDataTransfer(event.dataTransfer)
        if (files.length > 0) {
          event.preventDefault()
          onFiles?.(files)
          return true
        }
        return false
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const nextDoc = parseRichBody(value).doc
    const current = serializeRichBody(editor.getJSON())
    const incoming = serializeRichBody(nextDoc)
    if (current !== incoming) {
      editor.commands.setContent(nextDoc || emptyDoc(), false)
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  if (!editor) {
    return <div className={cx(styles.root, className)} />
  }

  function setLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className={cx(styles.root, className)} data-disabled={disabled}>
      <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
        <ToolbarBtn
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
        >
          <UnderlineIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
        >
          <Strikethrough size={14} />
        </ToolbarBtn>
        <span className={styles.sep} aria-hidden="true" />
        <ToolbarBtn
          label="Heading"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
        >
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
        >
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
        >
          <Code size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Link"
          active={editor.isActive('link')}
          onClick={setLink}
          disabled={disabled}
        >
          <Link2 size={14} />
        </ToolbarBtn>
        <span className={styles.sep} aria-hidden="true" />
        <ToolbarBtn
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo2 size={14} />
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} className={styles.content} />
    </div>
  )
}

function ToolbarBtn({ label, active, onClick, disabled, children }) {
  return (
    <button
      type="button"
      className={styles.toolBtn}
      data-active={active ? 'true' : 'false'}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}
