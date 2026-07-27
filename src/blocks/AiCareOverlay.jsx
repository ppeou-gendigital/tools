import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMutation } from '@tanstack/react-query'
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
import { Modal } from '@/patterns/Modal'
import {
  appendModelTurn,
  clearSession,
  loadSession,
  saveSession,
  sessionKey,
} from '@/lib/ai/aiCareSession'
import { applyCareAction } from '@/lib/ai/applyCareActions'
import {
  AI_ATTACH_MIME,
  assertAttachFile,
  createCareChat,
} from '@/lib/ai/careChat'
import { isAiCareEnabled } from '@/lib/ai/enabled'
import { mapAiError } from '@/lib/ai/errors'
import { formatByteSize, isImageMime } from '@/lib/attachmentsApi'
import {
  DATAFEED_TYPES,
  datafeedFilename,
  downloadTextFile,
  importDatafeedItems,
  parseDatafeed,
  stringifyDatafeed,
} from '@/lib/datafeed'
import { exportPatientDatafeed } from '@/lib/datafeed/buildFromVault'
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
import { useAuth } from '@/providers/AuthProvider'
import { usePatientVault } from '@/providers/PatientVaultProvider'
import { cx } from '@/lib/cx'
import styles from './AiCareOverlay.module.scss'

const WELCOME =
  'Ask me to schedule appointments, log visits, track medications or readings, or update doctors — or attach a photo/PDF of a med bottle, appointment card, or reading. Tap the mic to talk. I’ll propose changes you can Accept. Or Export JSON to edit in ChatGPT and Import it back. I’m an organizer — not a doctor.'

const CHATGPT_BLURB = `Please edit this Docto patient datafeed JSON.

Keep version 1 and type "patient" (or a typed feed).
Use plain dates (YYYY-MM-DD) and ISO-8601 datetimes.
Preserve cross-reference ids within the file (doctorId, officeId, …).
When done, return a complete JSON file I can Import back into Docto care chat.`

function actionPreview(action) {
  if (action.type?.startsWith('remove_')) {
    const n = (action.ids || []).length
    return n ? `${n} item${n === 1 ? '' : 's'}` : ''
  }
  if (action.doctor) {
    return [action.doctor.name, action.doctor.specialty]
      .filter(Boolean)
      .join(' · ')
  }
  if (action.appointment) {
    const a = action.appointment
    return [a.title || a.kind, a.startsAt].filter(Boolean).join(' · ')
  }
  if (action.visit) {
    const v = action.visit
    return [v.title || v.kind, v.visitDate].filter(Boolean).join(' · ')
  }
  if (action.medication) {
    const m = action.medication
    return [m.name, m.strength, m.status].filter(Boolean).join(' · ')
  }
  if (action.dose) {
    return [action.dose.medicationId, action.dose.takenAt || 'now']
      .filter(Boolean)
      .join(' · ')
  }
  if (action.reading) {
    const r = action.reading
    const bp = r.bloodPressure
      ? `${r.bloodPressure.systolic}/${r.bloodPressure.diastolic}`
      : null
    return [bp, r.pulse && `pulse ${r.pulse}`, r.weightKg && `${r.weightKg} kg`]
      .filter(Boolean)
      .join(' · ')
  }
  if (action.patient) {
    return [action.patient.preferredName, action.patient.birthday]
      .filter(Boolean)
      .join(' · ')
  }
  return ''
}

function actionDoneLabel(action) {
  if (action.type?.startsWith('remove_')) return 'Removed.'
  if (action.type?.startsWith('update_')) return 'Updated.'
  if (action.type === 'log_dose') return 'Dose logged.'
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

function firstAttachFile(files) {
  return (
    (files || []).find((f) =>
      AI_ATTACH_MIME.has(String(f?.type || '').toLowerCase()),
    ) || null
  )
}

export function AiCareOverlay({ open, patientId, onClose }) {
  const enabled = isAiCareEnabled()
  const titleId = useId()
  const { user } = useAuth()
  const vault = usePatientVault()
  const chatRef = useRef(null)
  const modelHistoryRef = useRef([])
  const responseRef = useRef(null)
  const panelRef = useRef(null)
  const plusBtnRef = useRef(null)
  const cameraRef = useRef(null)
  const attachUploadRef = useRef(null)
  const importFileRef = useRef(null)
  const sendRef = useRef(null)
  const voiceActiveRef = useRef(false)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [initError, setInitError] = useState('')
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [plusOpen, setPlusOpen] = useState(false)
  const [pendingAttach, setPendingAttach] = useState(null)
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null)
  const [voicePhase, setVoicePhase] = useState('idle')
  const [micDenied, setMicDenied] = useState(false)
  const [copyHint, setCopyHint] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const [importPaste, setImportPaste] = useState('')
  const [importBusy, setImportBusy] = useState(false)
  const [importError, setImportError] = useState('')
  const [importPreview, setImportPreview] = useState(null)

  const recognitionOk = speechRecognitionSupported()
  const speechLang = speechLangFromLocale('en-US')
  const canWrite = Boolean(vault.canWrite)
  const key = vault.getKey?.()
  const storageKey = sessionKey({
    userId: user?.id,
    patientId: patientId || vault.patientId,
  })
  const patientName = vault.patient?.preferredName?.trim() || 'Care'
  const title = `AI · ${patientName}`
  const canDictate = recognitionOk && !micDenied

  function stopVoiceSession() {
    voiceActiveRef.current = false
    stopDictation()
    stopSpeaking()
    setVoicePhase('idle')
  }

  function clearPendingAttach() {
    setPendingAttach(null)
    setPendingPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (cameraRef.current) cameraRef.current.value = ''
    if (attachUploadRef.current) attachUploadRef.current.value = ''
  }

  useEffect(() => {
    if (!open || !enabled) return undefined
    let cancelled = false

    async function boot() {
      setInitError('')
      setError('')
      setBusy(false)
      setReady(false)
      setPlusOpen(false)
      setCopyHint('')
      clearPendingAttach()
      stopVoiceSession()
      chatRef.current = null
      modelHistoryRef.current = []

      if (!canWrite) {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            text: 'This vault role is view-only. Care chat needs Can help or owner access to propose changes.',
            actions: [],
          },
        ])
        setReady(true)
        return
      }
      if (!user?.id || !patientId || !key) {
        setInitError('Unlock the patient vault to use care chat.')
        setMessages([])
        setReady(true)
        return
      }

      const saved = await loadSession(storageKey)
      if (cancelled) return
      modelHistoryRef.current = saved?.modelHistory || []
      setInput(saved?.input || '')
      const restored = saved?.messages?.length
        ? saved.messages
        : [
            {
              id: 'welcome',
              role: 'assistant',
              text: WELCOME,
              actions: [],
            },
          ]
      setMessages(restored)

      try {
        chatRef.current = await createCareChat({
          patientId,
          key,
          patient: vault.patient,
          history: modelHistoryRef.current,
        })
        if (!cancelled) setReady(true)
      } catch (err) {
        if (!cancelled) {
          setInitError(mapAiError(err))
          setReady(true)
        }
      }
    }

    boot()
    return () => {
      cancelled = true
      stopVoiceSession()
    }
  }, [
    open,
    enabled,
    canWrite,
    user?.id,
    patientId,
    key,
    storageKey,
    vault.patient,
  ])

  useEffect(() => {
    if (!open || !storageKey || !ready) return undefined
    const t = setTimeout(() => {
      saveSession(storageKey, {
        messages,
        input,
        modelHistory: modelHistoryRef.current,
      })
    }, 250)
    return () => clearTimeout(t)
  }, [open, storageKey, ready, messages, input])

  useEffect(() => {
    if (!open || !responseRef.current) return
    responseRef.current.scrollTop = responseRef.current.scrollHeight
  }, [messages, open, busy])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open || !recognitionOk) return undefined
    let cancelled = false
    queryMicrophonePermission().then((state) => {
      if (!cancelled && state === 'denied') setMicDenied(true)
    })
    return () => {
      cancelled = true
    }
  }, [open, recognitionOk])

  const applyMut = useMutation({
    mutationFn: async ({ action }) =>
      applyCareAction(action, {
        userId: user.id,
        patientId,
        key: vault.getKey(),
        patientProfile: vault.patient,
      }),
    onSuccess: ({ errors }, { messageId, actionId }) => {
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

  async function onSend({ text: overrideText, fromVoice = false } = {}) {
    const text = String(overrideText ?? input ?? '').trim()
    const attach = pendingAttach
    if ((!text && !attach) || busy || !chatRef.current || !canWrite) return
    setError('')
    setBusy(true)
    setInput('')
    const userText = text || (attach ? `(Attached ${attach.name || 'file'})` : '')
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: 'user',
        text: userText,
        actions: [],
        receiptFile: attach || null,
        receiptName: attach?.name || null,
        receiptPreviewUrl: pendingPreviewUrl || null,
      },
    ])
    clearPendingAttach()
    let sendFailed = false
    let assistantText = ''
    try {
      const turn = await chatRef.current.send(text, {
        files: attach ? [attach] : [],
      })
      assistantText = turn.assistant_message || ''
      modelHistoryRef.current = appendModelTurn(
        modelHistoryRef.current,
        userText,
        turn.assistant_message,
      )
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: turn.assistant_message,
          warnings: turn.warnings || [],
          actions: (turn.actions || []).map((a) => ({
            ...a,
            status: 'pending',
          })),
        },
      ])
    } catch (err) {
      sendFailed = true
      setError(mapAiError(err))
      if (fromVoice) stopVoiceSession()
    } finally {
      setBusy(false)
    }

    if (!sendFailed && fromVoice && voiceActiveRef.current && assistantText) {
      setVoicePhase('speaking')
      try {
        await speakText(assistantText, { lang: speechLang })
      } catch {
        /* ignore TTS failures */
      }
      if (voiceActiveRef.current) {
        startVoiceListen({ unlock: false })
      } else {
        setVoicePhase('idle')
      }
    }
  }

  useEffect(() => {
    sendRef.current = onSend
  })

  function onPickAttach(fileList) {
    const file = [...(fileList || [])].filter(Boolean)[0]
    if (!file) return
    try {
      assertAttachFile(file)
    } catch (err) {
      setError(err.message || 'Could not attach file')
      return
    }
    setError('')
    setPendingPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return isImageMime(file.type) ? URL.createObjectURL(file) : null
    })
    setPendingAttach(file)
  }

  function onComposerPaste(event) {
    const file = firstAttachFile(filesFromDataTransfer(event.clipboardData))
    if (!file) return
    event.preventDefault()
    event.stopPropagation()
    onPickAttach([file])
  }

  function onComposerDragOver(event) {
    if (![...(event.dataTransfer?.types || [])].includes('Files')) return
    event.preventDefault()
    event.stopPropagation()
  }

  function onComposerDrop(event) {
    const files = filesFromDataTransfer(event.dataTransfer)
    if (!firstAttachFile(files)) return
    event.preventDefault()
    event.stopPropagation()
    onPickAttach(files)
  }

  function startVoiceListen({ unlock = false } = {}) {
    if (!recognitionOk || micDenied || busy) return
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
      unlockSpeechSynthesis()
      stopSpeaking()
      startVoiceListen({ unlock: false })
      return
    }
    startVoiceListen({ unlock: true })
  }

  async function onExport() {
    setPlusOpen(false)
    setError('')
    setCopyHint('')
    try {
      const doc = await exportPatientDatafeed({
        patientId,
        key: vault.getKey(),
        patient: vault.patient,
      })
      downloadTextFile(
        datafeedFilename(DATAFEED_TYPES.PATIENT),
        stringifyDatafeed(doc),
      )
      setMessages((prev) => [
        ...prev,
        {
          id: `export-${Date.now()}`,
          role: 'assistant',
          text: `Exported patient datafeed JSON. Attach that file in ChatGPT with the copyable prompt, then Import the result here.`,
          actions: [],
        },
      ])
    } catch (err) {
      setError(err.message || 'Export failed')
    }
  }

  async function onCopyForChatgpt() {
    setPlusOpen(false)
    setError('')
    try {
      const doc = await exportPatientDatafeed({
        patientId,
        key: vault.getKey(),
        patient: vault.patient,
      })
      const payload = `${CHATGPT_BLURB}\n\n\`\`\`json\n${stringifyDatafeed(doc)}\n\`\`\``
      await navigator.clipboard.writeText(payload)
      setCopyHint('Copied prompt + JSON')
      setTimeout(() => setCopyHint(''), 2500)
    } catch (err) {
      setError(err.message || 'Copy failed')
    }
  }

  function resetImport() {
    setImportPaste('')
    setImportError('')
    setImportPreview(null)
    setImportBusy(false)
    if (importFileRef.current) importFileRef.current.value = ''
  }

  function closeImport() {
    setImportOpen(false)
    resetImport()
  }

  async function prepareImport(text) {
    setImportBusy(true)
    setImportError('')
    setImportPreview(null)
    try {
      const feed = parseDatafeed(text)
      const counts = {
        doctors: feed.doctors?.length || 0,
        appointments: feed.appointments?.length || 0,
        visits: feed.visits?.length || 0,
        medications: feed.medications?.length || 0,
        doses: feed.doses?.length || 0,
        readings: feed.readings?.length || 0,
        files: feed.files?.length || 0,
        patient: feed.patient ? 1 : 0,
        errors: feed.errors?.length || 0,
      }
      setImportPreview({ feed, counts })
    } catch (err) {
      setImportError(err?.message || 'Invalid datafeed JSON')
    } finally {
      setImportBusy(false)
    }
  }

  async function onPickImportFile(file) {
    if (!file) return
    try {
      const text = await file.text()
      await prepareImport(text)
    } catch (err) {
      setImportError(err.message || 'Could not read file')
    }
  }

  const applyImportMut = useMutation({
    mutationFn: () =>
      importDatafeedItems({
        userId: user.id,
        patientId,
        key: vault.getKey(),
        feed: importPreview.feed,
      }),
    onSuccess: (imported) => {
      const created =
        (imported.doctorsCreated || 0) +
        (imported.appointmentsCreated || 0) +
        (imported.visitsCreated || 0) +
        (imported.medicationsCreated || 0) +
        (imported.dosesCreated || 0) +
        (imported.readingsCreated || 0) +
        (imported.filesCreated || 0)
      setMessages((prev) => [
        ...prev,
        {
          id: `import-${Date.now()}`,
          role: 'assistant',
          text: [
            imported.patientUpdated ? 'Patient profile updated.' : null,
            `Imported ${created} new record${created === 1 ? '' : 's'} into this vault.`,
          ]
            .filter(Boolean)
            .join(' '),
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
    clearPendingAttach()
    if (!storageKey) return
    await clearSession(storageKey)
    modelHistoryRef.current = []
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: WELCOME,
        actions: [],
      },
    ])
    setInput('')
    setError('')
    if (canWrite && patientId && key) {
      try {
        chatRef.current = await createCareChat({
          patientId,
          key,
          patient: vault.patient,
          history: [],
        })
      } catch (err) {
        setInitError(mapAiError(err))
      }
    }
  }

  if (!open || !enabled) return null

  const isSparse = messages.length <= 1 && !busy
  const showPlusMenu = ready && canWrite

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
            onClick={() => {
              stopVoiceSession()
              onClose?.()
            }}
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
            {initError && (
              <p className={styles.error} role="alert">
                {initError}
              </p>
            )}
            {messages.map((m, index) => {
              const isUser = m.role === 'user'
              const hasMeta = (m.actions || []).length > 0
              const isHero =
                isSparse && index === 0 && !isUser && m.id === 'welcome'
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
                    {m.receiptFile && (
                      <div className={styles.receiptAttach}>
                        {m.receiptPreviewUrl ? (
                          <img
                            src={m.receiptPreviewUrl}
                            alt=""
                            className={styles.receiptThumb}
                          />
                        ) : (
                          <FileText size={16} aria-hidden="true" />
                        )}
                        <span className={styles.receiptName}>
                          {m.receiptName || 'Attachment'}
                        </span>
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
                      {(m.actions || []).map((action) => (
                        <div key={action.id} className={styles.actionCard}>
                          <strong>{action.label}</strong>
                          <span className={styles.hint}>
                            {actionPreview(action)}
                          </span>
                          {action.risky &&
                            !!(action.risk_notes || []).length && (
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
                                  })
                                }
                                disabled={applyMut.isPending || !canWrite}
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
                className={cx(
                  styles.turn,
                  styles.turnAssistant,
                  styles.turnWaiting,
                )}
                aria-live="polite"
                aria-busy="true"
              >
                <div className={styles.waitingBubble}>
                  <span className={styles.waitingDots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>Thinking…</span>
                </div>
              </div>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </div>

          <div className={styles.composerBar}>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => onPickAttach(e.target.files)}
            />
            <input
              ref={attachUploadRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              hidden
              onChange={(e) => onPickAttach(e.target.files)}
            />
            <div
              className={styles.promptBox}
              onPaste={onComposerPaste}
              onDragOver={onComposerDragOver}
              onDrop={onComposerDrop}
            >
              {pendingAttach && (
                <div className={styles.pendingChipRow}>
                  <div className={styles.pendingChip}>
                    {pendingPreviewUrl ? (
                      <img
                        src={pendingPreviewUrl}
                        alt=""
                        className={styles.pendingThumb}
                      />
                    ) : (
                      <FileText size={14} aria-hidden="true" />
                    )}
                    <span className={styles.pendingChipText}>
                      {pendingAttach.name || 'Attachment'}
                      <span className={styles.pendingChipMeta}>
                        {formatByteSize(pendingAttach.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      className={styles.pendingChipRemove}
                      onClick={clearPendingAttach}
                      aria-label="Remove attachment"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
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
                      : pendingAttach
                        ? 'Add a note (optional)…'
                        : canWrite
                          ? 'Message or paste a photo…'
                          : 'View-only — cannot send'
                }
                disabled={!ready || busy || !canWrite || !!initError}
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
                            attachUploadRef.current?.click()
                          }}
                        >
                          <Upload size={14} />
                          Upload file
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={styles.plusMenuBtn}
                          onClick={() => {
                            void onExport()
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
                            void onCopyForChatgpt()
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
                    disabled={busy || !canDictate || !canWrite}
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
                              : 'Talk with care chat'
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
                      !ready ||
                      busy ||
                      !canWrite ||
                      !!initError ||
                      (!String(input || '').trim() && !pendingAttach)
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
              Docto AI can make mistakes. It organizes records only — not
              medical advice. Nothing saves until you Accept.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={importOpen}
        onDismiss={closeImport}
        title="Import patient JSON"
      >
        <div className={styles.importSheet}>
          <p className={styles.hint}>
            Paste or upload a Docto <code>patient</code> datafeed JSON. Import
            always creates new records (and can update the patient profile). It
            does not delete existing ones.
          </p>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => onPickImportFile(e.target.files?.[0])}
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
              onClick={() => prepareImport(importPaste)}
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
          {importPreview && (
            <div className={styles.createPreview}>
              <h3>Ready to import</h3>
              <p className={styles.hint}>
                {importPreview.counts.patient
                  ? 'Includes patient profile · '
                  : ''}
                type {importPreview.feed.type || 'patient'}
              </p>
              <ul>
                <li>{importPreview.counts.doctors} doctors</li>
                <li>{importPreview.counts.appointments} appointments</li>
                <li>{importPreview.counts.visits} visits</li>
                <li>{importPreview.counts.medications} medications</li>
                <li>{importPreview.counts.doses} doses</li>
                <li>{importPreview.counts.readings} readings</li>
                <li>{importPreview.counts.files} files</li>
              </ul>
              <div className={styles.actionActions}>
                <Button
                  size="sm"
                  onClick={() => applyImportMut.mutate()}
                  disabled={applyImportMut.isPending || !canWrite}
                >
                  {applyImportMut.isPending ? 'Importing…' : 'Import into vault'}
                </Button>
                <Button size="sm" variant="outline" onClick={closeImport}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>,
    document.body,
  )
}
