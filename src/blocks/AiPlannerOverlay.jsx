import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Camera,
  ClipboardCopy,
  Download,
  FileText,
  MessageSquarePlus,
  Mic,
  MicOff,
  Plus,
  Send,
  Sparkles,
  Upload,
  Volume2,
  X,
} from 'lucide-react'
import { AnchoredPopover } from '@/molecules/AnchoredPopover'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Textarea } from '@/molecules/Textarea'
import { ConfirmDialog } from '@/patterns/ConfirmDialog'
import { Modal } from '@/patterns/Modal'
import {
  appendModelTurn,
  clearSession,
  loadSession,
  saveSession,
  sessionKey,
} from '@/lib/ai/aiPlannerSession'
import { applyChatAction } from '@/lib/ai/applyActions'
import { createTripChat } from '@/lib/ai/createTripChat'
import { isAiPlanningEnabled } from '@/lib/ai/enabled'
import { mapAiError } from '@/lib/ai/errors'
import {
  AI_RECEIPT_MIME,
  assertReceiptFile,
  createPlannerChat,
  MAX_AI_CHAT_FILES,
} from '@/lib/ai/plannerChat'
import {
  queryMicrophonePermission,
  speakText,
  speechLangFromLocale,
  speechRecognitionSupported,
  startDictation,
  stopDictation,
  stopSpeaking,
  unlockSpeechSynthesis,
} from '@/lib/speech'
import { resolvePlaylistItems } from '@/lib/youtubeSearch'
import { prepareImportedSnapshot } from '@/lib/ai/repairSnapshot'
import {
  formatByteSize,
  isImageMime,
  uploadAttachment,
} from '@/lib/attachmentsApi'
import {
  buildJourneySnapshot,
  downloadSnapshotJson,
  importJourneySnapshot,
  parseSnapshotFileLoose,
  parseSnapshotTextLoose,
  replaceJourneyFromSnapshot,
  snapshotFilename,
} from '@/lib/journeySnapshot'
import { supabase } from '@/lib/supabase'
import { getJourney, myMembership } from '@/lib/viaggioApi'
import { useAuth } from '@/providers/AuthProvider'
import { useDisplayPrefs } from '@/providers/DisplayPrefsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { cx } from '@/lib/cx'
import styles from './AiPlannerOverlay.module.scss'

const WELCOME_CHAT =
  'Ask me to add, update, or remove activities, todos, places, playlist, or expenses — or paste/attach a receipt photo/PDF. Tap the mic to talk. I’ll propose changes you can accept. Or Export JSON to edit in ChatGPT and Import it back.'

const WELCOME_CHAT_MAP =
  'I can suggest places near this map view (with pins you can accept), or help with activities, todos, playlist, and expenses. Ask for ideas — e.g. “scenic viewpoints” or “late-night eats”.'

const WELCOME_CREATE =
  'Chat with me about your trip — destination, dates, vibe, food, constraints. Attach booking screenshots, tickets, or PDFs and I’ll pull flights, stays, and travelers — then confirm which passenger is you. When a plan looks right I’ll show a draft; Create journey when you’re ready to commit.'

async function resolvePlannerDisplayName(user) {
  if (user?.id) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle()
      const fromProfile = String(data?.display_name || '').trim()
      if (fromProfile) return fromProfile
    } catch {
      /* fall through */
    }
  }
  return (
    String(user?.user_metadata?.display_name || '').trim() ||
    String(user?.user_metadata?.full_name || '').trim() ||
    user?.email?.split('@')[0] ||
    'Traveler'
  )
}

function travelerNamesFromSnapshot(snapshot) {
  return (Array.isArray(snapshot?.people) ? snapshot.people : [])
    .map((p) => String(p?.display_name || p?.displayName || '').trim())
    .filter(Boolean)
}

function SnapshotDraftStats({ snapshot }) {
  const names = travelerNamesFromSnapshot(snapshot)
  return (
    <>
      <ul>
        <li>
          {names.length} traveler{names.length === 1 ? '' : 's'}
        </li>
        <li>{(snapshot?.entries || []).length} activities</li>
        <li>{(snapshot?.todos || []).length} todos</li>
        <li>{(snapshot?.place_ideas || []).length} place ideas</li>
        <li>{(snapshot?.playlist || []).length} playlist items</li>
      </ul>
      {names.length > 0 && (
        <p className={styles.hint}>Travelers: {names.join(', ')}</p>
      )}
    </>
  )
}

const CHATGPT_BLURB = `Please edit this Viaggio journey snapshot JSON.

Keep format "viaggio.journey_snapshot" and version 1.
Use plain YYYY-MM-DD dates and IANA timezones (no Scope.* mashups).
Preserve activity_id values from the Viaggio catalog.
When done, return a complete JSON file I can Import back into the AI planner.`

function formatExpenseAmount(cents, currency) {
  const n = Number(cents)
  if (!Number.isFinite(n)) return ''
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(n / 100)
  } catch {
    return `${(n / 100).toFixed(2)} ${currency || ''}`.trim()
  }
}

function entryTimeHint(e) {
  const local =
    e.occurs_at_local ||
    (e.occurs_at && e.timezone
      ? `${e.occurs_at} (${e.timezone})`
      : e.occurs_at) ||
    e.occurs_on
  const endLocal =
    e.ends_at_local ||
    (e.ends_at && (e.end_timezone || e.timezone)
      ? `→ ${e.ends_at}`
      : e.ends_at
        ? `→ ${e.ends_at}`
        : '')
  const bits = [e.title, local, endLocal].filter(Boolean)
  return bits.join(' ')
}

function actionPreview(action) {
  if (action.type?.startsWith('remove_')) {
    const n = (action.ids || []).length
    return n ? `${n} item${n === 1 ? '' : 's'}` : ''
  }
  if (action.type === 'add_entries' || action.type === 'update_entries') {
    const base = (action.entries || []).map(entryTimeHint).join(', ')
    const risk = (action.risk_notes || []).join(' ')
    return [base, risk].filter(Boolean).join(' · ')
  }
  if (action.type === 'add_todos' || action.type === 'update_todos') {
    return (action.todos || [])
      .map((t) => t.title || t.id)
      .filter(Boolean)
      .join(', ')
  }
  if (
    action.type === 'add_place_ideas' ||
    action.type === 'update_place_ideas'
  ) {
    return (action.place_ideas || [])
      .map((p) => p.name || p.id)
      .filter(Boolean)
      .join(', ')
  }
  if (action.type === 'add_playlist' || action.type === 'update_playlist') {
    return (action.playlist || []).map((p) => p.title || p.id).join(', ')
  }
  if (
    (action.type === 'add_expense' || action.type === 'update_expense') &&
    action.expense
  ) {
    const e = action.expense
    const amount = formatExpenseAmount(e.amount_cents, e.currency)
    return [e.title, amount, e.category].filter(Boolean).join(' · ')
  }
  if (action.type === 'update_journey' && action.journey) {
    const j = action.journey
    return [
      j.title,
      j.starts_on && j.ends_on ? `${j.starts_on} → ${j.ends_on}` : j.starts_on || j.ends_on,
      j.default_timezone,
      j.default_currency,
    ]
      .filter(Boolean)
      .join(' · ')
  }
  return ''
}

function actionDoneLabel(action) {
  if (action.type?.startsWith('remove_')) return 'Removed.'
  if (action.type?.startsWith('update_')) return 'Updated.'
  if (action.type === 'add_expense') return 'Expense added.'
  return 'Added.'
}

function filesFromDataTransfer(dt) {
  if (!dt) return []
  if (dt.files?.length) return [...dt.files]
  const items = dt.items ? [...dt.items] : []
  return items
    .filter((it) => it.kind === 'file')
    .map((it) => it.getAsFile())
    .filter(Boolean)
}

function receiptFilesFromList(files) {
  return (files || []).filter((f) =>
    AI_RECEIPT_MIME.has(String(f?.type || '').toLowerCase()),
  )
}

function newAttachmentId() {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function messageReceipts(m) {
  if (Array.isArray(m?.receipts) && m.receipts.length) return m.receipts
  if (m?.receiptFile || m?.receiptName) {
    return [
      {
        file: m.receiptFile || null,
        name: m.receiptName || 'file',
        mime: m.receiptMime || '',
        previewUrl: m.receiptPreviewUrl || null,
      },
    ]
  }
  return []
}

export function AiPlannerOverlay({
  open,
  mode,
  journeyId,
  mapFocus = null,
  onClose,
}) {
  const enabled = isAiPlanningEnabled()
  const { user } = useAuth()
  const { displayLocale, defaultCurrency } = useDisplayPrefs()
  const nav = useNavigation()
  const qc = useQueryClient()
  const titleId = useId()
  const panelRef = useRef(null)
  const chatRef = useRef(null)
  const modelHistoryRef = useRef([])
  const createDraftRef = useRef(null)
  const skipSessionSaveRef = useRef(false)
  const importFileRef = useRef(null)
  const cameraRef = useRef(null)
  const receiptUploadRef = useRef(null)
  const responseRef = useRef(null)
  const plusBtnRef = useRef(null)
  const voiceActiveRef = useRef(false)
  const sendRef = useRef(null)
  const startVoiceListenRef = useRef(null)

  const isCreate = mode === 'create'
  const isChat = mode === 'chat'
  const speechLang = speechLangFromLocale(displayLocale)
  const recognitionOk = speechRecognitionSupported()
  const hasMapFocus =
    mapFocus &&
    Number.isFinite(Number(mapFocus.lat)) &&
    Number.isFinite(Number(mapFocus.lng))
  const chatWelcome = hasMapFocus ? WELCOME_CHAT_MAP : WELCOME_CHAT

  const [ready, setReady] = useState(false)
  const [initError, setInitError] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copyHint, setCopyHint] = useState('')
  const [createResult, setCreateResult] = useState(null)
  /** @type {[{ id: string, file: File, previewUrl: string | null }]} */
  const [pendingAttachments, setPendingAttachments] = useState([])
  /** idle | listening | speaking */
  const [voicePhase, setVoicePhase] = useState('idle')
  const [micDenied, setMicDenied] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importBusy, setImportBusy] = useState(false)
  const [importError, setImportError] = useState('')
  const [importPaste, setImportPaste] = useState('')
  const [importPreview, setImportPreview] = useState(null)
  const [confirmReplace, setConfirmReplace] = useState(false)
  const [plusOpen, setPlusOpen] = useState(false)

  useEffect(() => {
    return () => {
      for (const att of pendingAttachments) {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, [])

  function haltSpeechEngines() {
    voiceActiveRef.current = false
    stopDictation()
    stopSpeaking()
  }

  function stopVoiceSession() {
    haltSpeechEngines()
    setVoicePhase('idle')
  }

  useEffect(() => {
    if (open) return undefined
    haltSpeechEngines()
    return undefined
  }, [open])

  useEffect(() => {
    return () => {
      haltSpeechEngines()
    }
  }, [])

  useEffect(() => {
    if (!open || !recognitionOk) return undefined
    let cancelled = false
    queryMicrophonePermission().then((state) => {
      if (!cancelled) setMicDenied(state === 'denied')
    })
    return () => {
      cancelled = true
    }
  }, [open, recognitionOk])

  const canDictate = recognitionOk && !micDenied

  const { data: journey } = useQuery({
    queryKey: ['viaggio', 'journey', journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: open && isChat && !!journeyId,
  })

  const { data: membership } = useQuery({
    queryKey: ['viaggio', 'membership', journeyId, user?.id],
    queryFn: () => myMembership(journeyId, user.id),
    enabled: open && isChat && !!journeyId && !!user?.id,
  })

  const canEdit =
    membership?.role === 'owner' || membership?.role === 'editor'

  const activeSessionKey = sessionKey({
    mode: isCreate ? 'create' : 'chat',
    userId: user?.id,
    journeyId,
  })

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    setError('')
    setInitError('')
    setCopyHint('')
    setImportOpen(false)
    setImportPreview(null)
    setBusy(false)
    setPlusOpen(false)
    clearPendingAttachments()
    setVoicePhase('idle')
    haltSpeechEngines()

    let cancelled = false
    skipSessionSaveRef.current = true
    async function boot() {
      const stored = activeSessionKey
        ? await loadSession(activeSessionKey)
        : null
      if (cancelled) return

      if (!enabled) {
        setReady(false)
        skipSessionSaveRef.current = false
        return
      }

      if (isCreate) {
        setReady(false)
        try {
          const history = stored?.modelHistory || []
          const draft = stored?.createResult?.snapshot ?? null
          createDraftRef.current = draft
          chatRef.current = await createTripChat({
            history,
            preferredCurrency: defaultCurrency,
            displayLocale,
            getDraft: () => createDraftRef.current,
            importerName: await resolvePlannerDisplayName(user),
          })
          if (cancelled) return
          modelHistoryRef.current = history
          if (stored?.messages?.length) {
            setMessages(stored.messages)
            setCreateResult(stored.createResult ?? null)
            setInput(stored.input || '')
          } else {
            setCreateResult(null)
            setInput('')
            setMessages([
              {
                id: 'welcome-create',
                role: 'assistant',
                text: WELCOME_CREATE,
                actions: [],
              },
            ])
          }
          setReady(true)
          skipSessionSaveRef.current = false
        } catch (err) {
          if (!cancelled) {
            setInitError(mapAiError(err))
            skipSessionSaveRef.current = false
          }
        }
        return
      }

      if (!journeyId || !canEdit) {
        setReady(false)
        skipSessionSaveRef.current = false
        return
      }
      setReady(false)
      try {
        const history = stored?.modelHistory || []
        chatRef.current = await createPlannerChat(journeyId, {
          userId: user?.id,
          history,
          preferredCurrency: defaultCurrency,
          displayLocale,
          mapFocus: hasMapFocus ? mapFocus : null,
        })
        if (cancelled) return
        modelHistoryRef.current = history
        if (stored?.messages?.length) {
          setMessages(stored.messages)
          setInput(stored.input || '')
        } else {
          setInput('')
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              text: chatWelcome,
              actions: [],
            },
          ])
        }
        setCreateResult(null)
        createDraftRef.current = null
        setReady(true)
        skipSessionSaveRef.current = false
      } catch (err) {
        if (!cancelled) {
          setInitError(mapAiError(err))
          skipSessionSaveRef.current = false
        }
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [
    open,
    isCreate,
    enabled,
    journeyId,
    canEdit,
    user?.id,
    defaultCurrency,
    displayLocale,
    activeSessionKey,
    hasMapFocus,
    mapFocus?.lat,
    mapFocus?.lng,
    chatWelcome,
  ])

  useEffect(() => {
    createDraftRef.current = createResult?.snapshot ?? null
  }, [createResult])

  useEffect(() => {
    if (!open || !ready || !activeSessionKey || skipSessionSaveRef.current) {
      return
    }
    const timer = window.setTimeout(() => {
      if (skipSessionSaveRef.current) return
      void saveSession(activeSessionKey, {
        messages,
        createResult,
        input,
        modelHistory: modelHistoryRef.current,
      })
    }, 250)
    return () => window.clearTimeout(timer)
  }, [
    open,
    ready,
    activeSessionKey,
    messages,
    createResult,
    input,
  ])

  useEffect(() => {
    if (!open || !responseRef.current) return
    responseRef.current.scrollTop = responseRef.current.scrollHeight
  }, [messages, createResult, open, busy])

  function invalidateJourneyQueries() {
    if (!journeyId) return
    qc.invalidateQueries({ queryKey: ['viaggio', 'journey', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entries', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entry'] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'entry-participants'] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'todos', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'place-ideas', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'playlist', journeyId] })
    qc.invalidateQueries({ queryKey: ['viaggio', 'expenses', journeyId] })
  }

  const applyMut = useMutation({
    mutationFn: async ({ action, receiptFiles }) => {
      const result = await applyChatAction(journeyId, action, user.id)
      const files = (
        receiptFiles?.length
          ? receiptFiles
          : action.receiptFiles?.length
            ? action.receiptFiles
            : action.receiptFile
              ? [action.receiptFile]
              : []
      ).filter(Boolean)
      if (
        !result.errors.length &&
        action.type === 'add_expense' &&
        files.length &&
        result.applied?.expenses?.[0]
      ) {
        const saved = result.applied.expenses[0]
        for (const file of files) {
          try {
            await uploadAttachment({
              journeyId: journeyId || saved.journeyId || null,
              userId: user.id,
              file,
              expenseIds: saved.id ? [saved.id] : [],
              entryIds: [
                ...new Set(
                  [
                    ...(saved.entryIds || []),
                    saved.entryId,
                    action.expense?.entry_id,
                    ...(action.expense?.entry_ids || []),
                  ].filter(Boolean),
                ),
              ],
            })
          } catch (err) {
            result.errors.push(
              `Expense saved, but receipt upload failed: ${err.message}`,
            )
          }
        }
      }
      return result
    },
    onSuccess: ({ errors }, { messageId, actionId }) => {
      invalidateJourneyQueries()
      qc.invalidateQueries({ queryKey: ['viaggio', 'expense-receipts'] })
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m
          return {
            ...m,
            actions: (m.actions || []).map((a) =>
              a.id === actionId
                ? {
                    ...a,
                    status: errors.length ? 'error' : 'accepted',
                    error: errors.join('; '),
                  }
                : a,
            ),
          }
        }),
      )
    },
    onError: (err) => setError(err.message || 'Apply failed'),
  })

  const createJourneyMut = useMutation({
    mutationFn: (snapshot) =>
      importJourneySnapshot(snapshot || createResult?.snapshot, { user }),
    onSuccess: ({ journey: created }) => {
      qc.invalidateQueries({ queryKey: ['viaggio', 'journeys'] })
      onClose?.()
      nav.replace('journey', { journeyId: created.id })
    },
    onError: (err) => setError(err.message || 'Could not create journey'),
  })

  async function onExport() {
    setError('')
    setCopyHint('')
    try {
      const snap = await buildJourneySnapshot(journeyId)
      downloadSnapshotJson(snap, snapshotFilename(snap))
      setMessages((prev) => [
        ...prev,
        {
          id: `export-${Date.now()}`,
          role: 'assistant',
          text: `Exported “${snap.journey.title}” (${(snap.entries || []).length} activities). Attach that file in ChatGPT with the copyable prompt, then Import the result here.`,
          actions: [],
        },
      ])
    } catch (err) {
      setError(err.message || 'Export failed')
    }
  }

  async function onCopyForChatgpt() {
    setError('')
    try {
      await navigator.clipboard.writeText(CHATGPT_BLURB)
      setCopyHint('Copied prompt for ChatGPT')
      window.setTimeout(() => setCopyHint(''), 2500)
    } catch {
      setError('Could not copy to clipboard')
    }
  }

  function resetImport() {
    setImportError('')
    setImportPaste('')
    setImportPreview(null)
    setConfirmReplace(false)
    if (importFileRef.current) importFileRef.current.value = ''
  }

  function clearPendingAttachments() {
    setPendingAttachments((prev) => {
      for (const att of prev) {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl)
      }
      return []
    })
    if (cameraRef.current) cameraRef.current.value = ''
    if (receiptUploadRef.current) receiptUploadRef.current.value = ''
  }

  function removePendingAttachment(id) {
    setPendingAttachments((prev) => {
      const next = []
      for (const att of prev) {
        if (att.id === id) {
          if (att.previewUrl) URL.revokeObjectURL(att.previewUrl)
        } else {
          next.push(att)
        }
      }
      return next
    })
    if (cameraRef.current) cameraRef.current.value = ''
    if (receiptUploadRef.current) receiptUploadRef.current.value = ''
  }

  function onPickReceipt(fileList) {
    const incoming = [...(fileList || [])].filter(Boolean)
    if (!incoming.length) return

    const accepted = []
    const errors = []
    for (const file of incoming) {
      try {
        assertReceiptFile(file)
        accepted.push(file)
      } catch (err) {
        errors.push(err.message || 'Could not attach file')
      }
    }
    if (!accepted.length) {
      setError(errors[0] || 'Could not attach file')
      return
    }

    let skippedForCap = 0
    setPendingAttachments((prev) => {
      const room = MAX_AI_CHAT_FILES - prev.length
      if (room <= 0) {
        skippedForCap = accepted.length
        return prev
      }
      const take = accepted.slice(0, room)
      skippedForCap = accepted.length - take.length
      return [
        ...prev,
        ...take.map((file) => ({
          id: newAttachmentId(),
          file,
          previewUrl: isImageMime(file.type)
            ? URL.createObjectURL(file)
            : null,
        })),
      ]
    })

    if (skippedForCap > 0) {
      setError(
        `Only ${MAX_AI_CHAT_FILES} files allowed; extra files were skipped.`,
      )
    } else if (errors.length) {
      setError(errors[0])
    } else {
      setError('')
    }
  }

  function tryAttachReceiptFiles(files) {
    if (!isChat && !isCreate) return false
    const list = receiptFilesFromList(files)
    if (!list.length) return false
    onPickReceipt(list)
    return true
  }

  function onComposerPaste(event) {
    if (!isChat && !isCreate) return
    const list = receiptFilesFromList(
      filesFromDataTransfer(event.clipboardData),
    )
    if (!list.length) return
    event.preventDefault()
    event.stopPropagation()
    onPickReceipt(list)
  }

  function onComposerDragOver(event) {
    if (!isChat && !isCreate) return
    if (![...(event.dataTransfer?.types || [])].includes('Files')) return
    event.preventDefault()
    event.stopPropagation()
  }

  function onComposerDrop(event) {
    if (!isChat && !isCreate) return
    const files = filesFromDataTransfer(event.dataTransfer)
    if (!receiptFilesFromList(files).length) return
    event.preventDefault()
    event.stopPropagation()
    tryAttachReceiptFiles(files)
  }

  function startVoiceListen({ unlock = false } = {}) {
    if (!recognitionOk || micDenied || busy) return
    // Unlock TTS during the mic tap so replies can speak after the AI returns
    // (iOS Safari blocks speechSynthesis outside a user-gesture chain).
    if (unlock) unlockSpeechSynthesis()
    stopSpeaking()
    stopDictation()
    voiceActiveRef.current = true
    setVoicePhase('listening')
    setError('')
    setInput('')
    startDictation({
      lang: speechLang,
      continuous: false,
      onInterim: (t) => {
        if (voiceActiveRef.current) setInput(t)
      },
      onFinal: (t) => {
        if (!voiceActiveRef.current) return
        stopDictation()
        setInput(t)
        void sendRef.current?.({ text: t, fromVoice: true })
      },
      onError: (err) => {
        if (!voiceActiveRef.current) return
        const msg = err?.message || 'Speech recognition failed'
        if (/permission denied|not-allowed/i.test(msg)) {
          setMicDenied(true)
        }
        setError(msg)
        stopVoiceSession()
      },
    })
  }

  function toggleVoice() {
    if (!canDictate || busy) return
    if (voicePhase === 'listening') {
      stopVoiceSession()
      return
    }
    if (voicePhase === 'speaking') {
      // Interrupt reply — stay in voice mode and listen again.
      unlockSpeechSynthesis()
      stopSpeaking()
      startVoiceListen({ unlock: false })
      return
    }
    startVoiceListen({ unlock: true })
  }

  function closeImport() {
    setImportOpen(false)
    resetImport()
  }

  async function runPrepare(raw) {
    setImportBusy(true)
    setImportError('')
    setImportPreview(null)
    try {
      const result = await prepareImportedSnapshot(raw, {
        importerName:
          user?.user_metadata?.full_name ||
          user?.email?.split('@')[0] ||
          'Traveler',
        useAiRepair: enabled,
      })
      setImportPreview(result)
    } catch (err) {
      setImportError(mapAiError(err))
    } finally {
      setImportBusy(false)
    }
  }

  async function onPickFile(file) {
    if (!file) return
    try {
      const raw = await parseSnapshotFileLoose(file)
      await runPrepare(raw)
    } catch (err) {
      setImportError(err.message || 'Could not read file')
    }
  }

  async function onPastePrepare() {
    try {
      const raw = parseSnapshotTextLoose(importPaste)
      await runPrepare(raw)
    } catch (err) {
      setImportError(err.message || 'Invalid JSON')
    }
  }

  const applyImportMut = useMutation({
    mutationFn: () =>
      replaceJourneyFromSnapshot(journeyId, importPreview.snapshot, { user }),
    onSuccess: (result) => {
      invalidateJourneyQueries()
      const c = result.counts || {}
      setMessages((prev) => [
        ...prev,
        {
          id: `import-${Date.now()}`,
          role: 'assistant',
          text: `Imported into this journey: ${c.entries ?? 0} activities, ${c.todos ?? 0} todos, ${c.place_ideas ?? 0} places, ${c.playlist ?? 0} playlist tracks. Members were kept.`,
          actions: [],
        },
      ])
      closeImport()
    },
    onError: (err) => setImportError(err.message || 'Import failed'),
  })

  async function onNewChat() {
    setPlusOpen(false)
    stopVoiceSession()
    setError('')
    setBusy(false)
    setCreateResult(null)
    createDraftRef.current = null
    setInput('')
    clearPendingAttachments()
    modelHistoryRef.current = []
    if (activeSessionKey) await clearSession(activeSessionKey)

    if (isCreate) {
      if (!enabled) return
      setReady(false)
      try {
        chatRef.current = await createTripChat({
          history: [],
          preferredCurrency: defaultCurrency,
          displayLocale,
          getDraft: () => createDraftRef.current,
          importerName: await resolvePlannerDisplayName(user),
        })
        setMessages([
          {
            id: 'welcome-create',
            role: 'assistant',
            text: WELCOME_CREATE,
            actions: [],
          },
        ])
        setReady(true)
      } catch (err) {
        setInitError(mapAiError(err))
      }
      return
    }

    if (!enabled || !journeyId || !canEdit) return
    setReady(false)
    try {
      chatRef.current = await createPlannerChat(journeyId, {
        userId: user?.id,
        history: [],
        preferredCurrency: defaultCurrency,
        displayLocale,
        mapFocus: hasMapFocus ? mapFocus : null,
      })
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: chatWelcome,
          actions: [],
        },
      ])
      setReady(true)
    } catch (err) {
      setInitError(mapAiError(err))
    }
  }

  async function onSend({ text: textOverride, fromVoice = false } = {}) {
    const text = String(textOverride ?? input).trim()
    const attachments =
      isChat || isCreate ? [...pendingAttachments] : []
    const files = attachments.map((a) => a.file).filter(Boolean)
    if ((!text && !files.length) || busy) return
    if (fromVoice) stopDictation()
    setBusy(true)
    setError('')
    setInput('')
    const userMsgId = `u-${Date.now()}`
    const userText =
      text ||
      (files.length === 1
        ? `${isCreate ? 'Attachment' : 'Receipt'}: ${files[0].name || 'file'}`
        : files.length > 1
          ? `${isCreate ? 'Attachments' : 'Receipts'}: ${files.length} files`
          : '')
    const receiptMeta = files.length
      ? {
          receipts: attachments.map((a) => ({
            file: a.file,
            name: a.file?.name || 'file',
            mime: a.file?.type || '',
            previewUrl: a.previewUrl,
          })),
        }
      : {}
    // Transfer ownership of preview URLs to the message; clear composer.
    if (files.length) {
      setPendingAttachments([])
      if (cameraRef.current) cameraRef.current.value = ''
      if (receiptUploadRef.current) receiptUploadRef.current.value = ''
    }
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        text: userText,
        actions: [],
        ...receiptMeta,
      },
    ])

    let assistantText = ''
    let sendFailed = false
    try {
      if (isCreate) {
        if (!chatRef.current) return
        const turn = await chatRef.current.send(text, {
          files,
        })
        assistantText = turn.assistant_message || ''
        modelHistoryRef.current = appendModelTurn(
          modelHistoryRef.current,
          userText,
          turn.assistant_message,
        )
        if (turn.snapshot) {
          const data = { snapshot: turn.snapshot, summary: turn.assistant_message }
          createDraftRef.current = turn.snapshot
          setCreateResult(data)
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text: turn.assistant_message,
              actions: [],
              createPreview: true,
              createSnapshot: turn.snapshot,
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text: turn.assistant_message,
              actions: [],
            },
          ])
        }
      } else {
        if (!chatRef.current) return
        const turn = await chatRef.current.send(text, {
          files,
        })
        assistantText = turn.assistant_message || ''
        modelHistoryRef.current = appendModelTurn(
          modelHistoryRef.current,
          userText,
          turn.assistant_message,
        )
        const expenseActions = (turn.actions || []).filter(
          (a) => a.type === 'add_expense',
        )
        const actions = []
        let expenseOrdinal = 0
        for (const a of turn.actions || []) {
          let receiptFiles = null
          if (a.type === 'add_expense' && files.length) {
            if (expenseActions.length === 1) {
              receiptFiles = files
            } else if (expenseActions.length === files.length) {
              receiptFiles = [files[expenseOrdinal]].filter(Boolean)
            } else {
              receiptFiles = files
            }
            expenseOrdinal += 1
          }
          let next = {
            ...a,
            status: 'pending',
            receiptFiles,
          }
          if (
            (a.type === 'add_playlist' || a.type === 'update_playlist') &&
            (a.playlist || []).length
          ) {
            try {
              const resolved = await resolvePlaylistItems(a.playlist)
              if (!resolved.length) {
                next = {
                  ...next,
                  status: 'error',
                  error:
                    'Could not find playable YouTube videos for those titles.',
                  playlist: a.playlist,
                }
              } else {
                next = { ...next, playlist: resolved }
              }
            } catch (err) {
              next = {
                ...next,
                status: 'error',
                error: err.message || 'YouTube search failed',
              }
            }
          }
          actions.push(next)
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: turn.assistant_message,
            warnings: turn.warnings || [],
            actions,
          },
        ])
      }
    } catch (err) {
      sendFailed = true
      setError(mapAiError(err))
      if (fromVoice) stopVoiceSession()
    } finally {
      setBusy(false)
    }

    if (
      !sendFailed &&
      fromVoice &&
      voiceActiveRef.current &&
      assistantText.trim()
    ) {
      setVoicePhase('speaking')
      // Re-unlock is a no-op after the mic tap, but helps desktop Chrome
      // if the synth got stuck paused during the long AI wait.
      try {
        window.speechSynthesis?.resume?.()
      } catch {
        /* ignore */
      }
      await speakText(assistantText, { lang: speechLang })
      if (voiceActiveRef.current) {
        startVoiceListenRef.current?.({ unlock: false })
      } else {
        setVoicePhase('idle')
      }
    } else if (fromVoice && !voiceActiveRef.current) {
      setVoicePhase('idle')
    }
  }

  useEffect(() => {
    sendRef.current = onSend
    startVoiceListenRef.current = startVoiceListen
  })

  if (!open || typeof document === 'undefined') return null

  const title = isCreate
    ? 'Plan with AI'
    : journey?.title
      ? `AI · ${journey.title}`
      : 'AI planner'

  const previewSnap = importPreview?.snapshot
  const previewJourney = previewSnap?.journey

  const chatBlocked = isChat && membership && !canEdit
  const showComposer =
    enabled && !chatBlocked && ready && !initError

  const hasPendingActions = messages.some((m) =>
    (m.actions || []).some((a) => a.status === 'pending'),
  )
  const isSparse =
    messages.length <= 2 && !hasPendingActions && !createResult
  // Match Docto: + menu as soon as chat is ready (create or editable journey).
  const showPlusMenu = ready && ((isChat && canEdit) || isCreate)

  return createPortal(
    <>
      <div className={styles.backdrop}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={styles.panel}
        >
          <Button
            variant="ghost"
            size="sm"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <X size={22} strokeWidth={2.25} aria-hidden="true" />
          </Button>
          <header className={styles.header}>
            <div className={styles.headerRow}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </div>
            {copyHint && <p className={styles.hint}>{copyHint}</p>}
          </header>

          <div
            ref={responseRef}
            className={styles.response}
            data-sparse={isSparse ? 'true' : undefined}
          >
            {!enabled && (
              <p className={styles.error}>
                AI planning is not enabled on this build.
              </p>
            )}
            {chatBlocked && (
              <p className={styles.error}>
                Only organizers and travelers can chat with the planner.
              </p>
            )}
            {initError && (
              <p className={styles.error} role="alert">
                {initError}
              </p>
            )}
            {messages.map((m, index) => {
              const isUser = m.role === 'user'
              const turnSnapshot =
                m.createSnapshot ||
                (m.createPreview ? createResult?.snapshot : null)
              const turnJourney = turnSnapshot?.journey
              const hasMeta =
                !!(m.createPreview && turnJourney) ||
                (m.actions && m.actions.length > 0)
              const isHero =
                isSparse &&
                index === 0 &&
                !isUser &&
                (m.id === 'welcome' || m.id === 'welcome-create')
              const turnReceipts = messageReceipts(m)
              return (
                <div
                  key={m.id}
                  className={cx(
                    styles.turn,
                    isUser ? styles.turnUser : styles.turnAssistant,
                    isHero && styles.turnHero,
                  )}
                >
                  <div className={styles.bubble}>
                    {turnReceipts.length > 0 && (
                      <div className={styles.receiptAttachRow}>
                        {turnReceipts.map((r, i) => (
                          <div
                            key={`${m.id}-r-${i}`}
                            className={styles.receiptAttach}
                          >
                            {r.previewUrl ? (
                              <img
                                src={r.previewUrl}
                                alt=""
                                className={styles.receiptThumb}
                              />
                            ) : (
                              <FileText size={16} aria-hidden="true" />
                            )}
                            <span className={styles.receiptName}>
                              {r.name || 'Receipt'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {m.text}
                    {!!(m.warnings || []).length && (
                      <p className={styles.hint}>
                        {(m.warnings || []).join(' ')}
                      </p>
                    )}
                    {!isUser &&
                      (m.actions || []).some((a) => a.status === 'pending') && (
                        <p className={styles.hint}>
                          Review the proposed change(s) below, then Accept or
                          Reject.
                        </p>
                      )}
                  </div>
                  {hasMeta && !isUser && (
                    <div className={styles.turnMeta}>
                      {m.createPreview && turnJourney && (
                        <div className={styles.createPreview}>
                          <h3>{turnJourney.title}</h3>
                          <p className={styles.hint}>
                            {turnJourney.starts_on || '—'} →{' '}
                            {turnJourney.ends_on || '—'} ·{' '}
                            {turnJourney.default_timezone} ·{' '}
                            {turnJourney.default_currency}
                          </p>
                          <SnapshotDraftStats snapshot={turnSnapshot} />
                          <div className={styles.actionActions}>
                            <Button
                              size="sm"
                              onClick={() =>
                                createJourneyMut.mutate(turnSnapshot)
                              }
                              disabled={createJourneyMut.isPending}
                            >
                              {createJourneyMut.isPending
                                ? 'Creating…'
                                : 'Create journey'}
                            </Button>
                          </div>
                        </div>
                      )}
                      {(m.actions || []).map((action) => (
                        <div key={action.id} className={styles.actionCard}>
                          <strong>{action.label}</strong>
                          <span className={styles.hint}>
                            {actionPreview(action)}
                          </span>
                          {action.risky && !!(action.risk_notes || []).length && (
                            <span className={styles.error}>
                              {(action.risk_notes || []).join(' ')}
                            </span>
                          )}
                          {action.status === 'pending' && (
                            <div className={styles.actionActions}>
                              <Button
                                size="sm"
                                onClick={() =>
                                  applyMut.mutate({
                                    action,
                                    messageId: m.id,
                                    actionId: action.id,
                                    receiptFiles:
                                      action.receiptFiles ||
                                      (action.receiptFile
                                        ? [action.receiptFile]
                                        : []),
                                  })
                                }
                                disabled={applyMut.isPending}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setMessages((prev) =>
                                    prev.map((msg) =>
                                      msg.id !== m.id
                                        ? msg
                                        : {
                                            ...msg,
                                            actions: msg.actions.map((a) =>
                                              a.id === action.id
                                                ? { ...a, status: 'rejected' }
                                                : a,
                                            ),
                                          },
                                    ),
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {action.status === 'accepted' && (
                            <span className={styles.hint}>
                              {actionDoneLabel(action)}
                            </span>
                          )}
                          {action.status === 'rejected' && (
                            <span className={styles.hint}>Dismissed.</span>
                          )}
                          {action.status === 'error' && (
                            <span className={styles.error}>{action.error}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {busy && (
              <div
                className={cx(styles.turn, styles.turnAssistant, styles.turnWaiting)}
                aria-live="polite"
                aria-busy="true"
              >
                <div className={styles.waitingBubble}>
                  <span className={styles.waitingDots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>{isCreate ? 'Planning…' : 'Thinking…'}</span>
                </div>
              </div>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>

          {showComposer && (
            <div className={styles.composerBar}>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => {
                  onPickReceipt(e.target.files)
                  e.target.value = ''
                }}
              />
              <input
                ref={receiptUploadRef}
                type="file"
                accept="image/*,application/pdf,.pdf"
                multiple
                hidden
                onChange={(e) => {
                  onPickReceipt(e.target.files)
                  e.target.value = ''
                }}
              />
              <div
                className={styles.promptBox}
                onPaste={onComposerPaste}
                onDragOver={onComposerDragOver}
                onDrop={onComposerDrop}
              >
                {pendingAttachments.length > 0 && (
                  <div className={styles.pendingChipRow}>
                    {pendingAttachments.map((att) => (
                      <div key={att.id} className={styles.pendingChip}>
                        {att.previewUrl ? (
                          <img
                            src={att.previewUrl}
                            alt=""
                            className={styles.pendingThumb}
                          />
                        ) : (
                          <FileText size={14} aria-hidden="true" />
                        )}
                        <span className={styles.pendingChipText}>
                          {att.file?.name || 'Receipt'}
                          <span className={styles.pendingChipMeta}>
                            {formatByteSize(att.file?.size)}
                          </span>
                        </span>
                        <button
                          type="button"
                          className={styles.pendingChipRemove}
                          onClick={() => removePendingAttachment(att.id)}
                          aria-label={`Remove ${att.file?.name || 'attachment'}`}
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Input
                  className={styles.promptInput}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    voicePhase === 'listening'
                      ? 'Listening…'
                      : voicePhase === 'speaking'
                        ? 'Speaking…'
                        : pendingAttachments.length
                          ? 'Add a note (optional)…'
                          : isCreate
                            ? 'Message or attach booking(s)…'
                            : hasMapFocus
                              ? 'Suggest places near this map…'
                              : isChat
                                ? 'Message or paste receipt(s)…'
                                : 'Write a message…'
                  }
                  onPaste={onComposerPaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void onSend()
                    }
                  }}
                  autoComplete="off"
                />
                <div className={styles.promptToolbar}>
                  {showPlusMenu && (
                    <>
                      <Button
                        ref={plusBtnRef}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={styles.promptIconBtn}
                        onClick={() => setPlusOpen((o) => !o)}
                        aria-label="More actions"
                        title="More actions"
                        aria-expanded={plusOpen}
                      >
                        <Plus size={18} aria-hidden="true" />
                      </Button>
                      <AnchoredPopover
                        open={plusOpen}
                        onClose={() => setPlusOpen(false)}
                        anchorRef={plusBtnRef}
                        align="start"
                        fluid
                        aria-label="Composer actions"
                      >
                        <div className={styles.plusMenu}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={styles.plusMenuBtn}
                            onClick={() => {
                              void onNewChat()
                            }}
                            disabled={busy}
                          >
                            <MessageSquarePlus size={14} />
                            New chat
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={styles.plusMenuBtn}
                            onClick={() => {
                              setPlusOpen(false)
                              cameraRef.current?.click()
                            }}
                          >
                            <Camera size={14} />
                            Take photo
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={styles.plusMenuBtn}
                            onClick={() => {
                              setPlusOpen(false)
                              receiptUploadRef.current?.click()
                            }}
                          >
                            <Upload size={14} />
                            Upload file
                          </Button>
                          {isChat && (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={styles.plusMenuBtn}
                                onClick={() => {
                                  setPlusOpen(false)
                                  onExport()
                                }}
                              >
                                <Download size={14} />
                                Export JSON
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={styles.plusMenuBtn}
                                onClick={() => {
                                  setPlusOpen(false)
                                  onCopyForChatgpt()
                                }}
                              >
                                <ClipboardCopy size={14} />
                                Copy prompt
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={styles.plusMenuBtn}
                                onClick={() => {
                                  setPlusOpen(false)
                                  resetImport()
                                  setImportOpen(true)
                                }}
                              >
                                <FileText size={14} />
                                Import JSON
                              </Button>
                            </>
                          )}
                        </div>
                      </AnchoredPopover>
                    </>
                  )}
                  <div className={styles.promptToolbarEnd}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cx(
                        styles.promptIconBtn,
                        voicePhase === 'listening' && styles.promptMicListening,
                        voicePhase === 'speaking' && styles.promptMicSpeaking,
                      )}
                      onClick={toggleVoice}
                      disabled={busy || !canDictate}
                      aria-label={
                        voicePhase === 'listening'
                          ? 'Stop voice conversation'
                          : voicePhase === 'speaking'
                            ? 'Interrupt and listen'
                            : 'Start voice conversation'
                      }
                      title={
                        !recognitionOk
                          ? 'Voice not supported in this browser'
                          : micDenied
                            ? 'Microphone blocked in browser settings'
                            : voicePhase === 'listening'
                              ? 'Stop listening'
                              : voicePhase === 'speaking'
                                ? 'Interrupt reply'
                                : 'Talk with the planner'
                      }
                      aria-pressed={voicePhase !== 'idle'}
                    >
                      {voicePhase === 'listening' ? (
                        <MicOff size={18} aria-hidden="true" />
                      ) : voicePhase === 'speaking' ? (
                        <Volume2 size={18} aria-hidden="true" />
                      ) : (
                        <Mic size={18} aria-hidden="true" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className={styles.promptSend}
                      onClick={() => void onSend()}
                      disabled={
                        busy ||
                        (!input.trim() && pendingAttachments.length === 0)
                      }
                      aria-label={busy ? 'Sending' : 'Send'}
                    >
                      {busy ? (
                        <Sparkles size={14} aria-hidden="true" />
                      ) : (
                        <Send size={14} aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <p className={styles.disclaimer}>
                Viaggio AI can make mistakes. Double-check plans before you
                travel.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={importOpen}
        onDismiss={closeImport}
        title="Import journey JSON"
      >
        <div className={styles.importSheet}>
          <p className={styles.hint}>
            Paste or upload a <code>viaggio.journey_snapshot</code> file. We’ll
            validate, sanitize, and optionally repair with AI before replacing
            this journey’s timeline. Members stay.
          </p>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
          <Textarea
            rows={6}
            value={importPaste}
            onChange={(e) => setImportPaste(e.target.value)}
            placeholder="Or paste JSON here…"
          />
          <div className={styles.actionActions}>
            <Button
              size="sm"
              variant="outline"
              onClick={onPastePrepare}
              disabled={importBusy || !importPaste.trim()}
            >
              {importBusy ? 'Preparing…' : 'Prepare paste'}
            </Button>
          </div>
          {importError && (
            <p className={styles.error} role="alert">
              {importError}
            </p>
          )}
          {importPreview && previewJourney && (
            <div className={styles.createPreview}>
              {importPreview.repaired && (
                <p className={styles.hint}>
                  AI repaired this JSON
                  {importPreview.notes?.length
                    ? `: ${importPreview.notes.slice(0, 2).join('; ')}`
                    : '.'}
                </p>
              )}
              <h3>{previewJourney.title}</h3>
              <p className={styles.hint}>
                {previewJourney.starts_on || '—'} →{' '}
                {previewJourney.ends_on || '—'} ·{' '}
                {previewJourney.default_timezone} ·{' '}
                {previewJourney.default_currency}
              </p>
              <SnapshotDraftStats snapshot={previewSnap} />
              <div className={styles.actionActions}>
                <Button
                  size="sm"
                  onClick={() => setConfirmReplace(true)}
                  disabled={applyImportMut.isPending}
                >
                  Apply to this journey
                </Button>
                <Button size="sm" variant="outline" onClick={closeImport}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmReplace}
        onDismiss={() => setConfirmReplace(false)}
        title="Replace timeline?"
        message={`This overwrites activities, todos, place ideas, playlist, and expenses on “${journey?.title || 'this journey'}”. People and members stay.`}
        confirmLabel="Replace timeline"
        confirming={applyImportMut.isPending}
        onConfirm={() => {
          setConfirmReplace(false)
          applyImportMut.mutate()
        }}
      />
    </>,
    document.body,
  )
}
