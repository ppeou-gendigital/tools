import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { PromptDialog } from '@/patterns/PromptDialog'

const PromptContext = createContext(null)

let nextRequestId = 0

export function PromptProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolverRef = useRef(null)

  const settle = useCallback((result) => {
    const resolve = resolverRef.current
    resolverRef.current = null
    setRequest(null)
    resolve?.(result)
  }, [])

  const prompt = useCallback((options = {}) => {
    if (resolverRef.current) {
      // Replace any in-flight request (should be rare).
      resolverRef.current(null)
      resolverRef.current = null
    }
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setRequest({
        id: ++nextRequestId,
        mode: 'prompt',
        title: options.title ?? 'Prompt',
        message: options.message,
        label: options.label,
        defaultValue: options.defaultValue ?? '',
        type: options.type ?? 'text',
        autoComplete: options.autoComplete,
        confirmLabel: options.confirmLabel ?? 'OK',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        destructive: Boolean(options.destructive),
      })
    })
  }, [])

  const confirm = useCallback((options = {}) => {
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setRequest({
        id: ++nextRequestId,
        mode: 'confirm',
        title: options.title ?? 'Confirm',
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'OK',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        destructive: Boolean(options.destructive),
      })
    })
  }, [])

  const value = useMemo(() => ({ prompt, confirm }), [prompt, confirm])

  return (
    <PromptContext.Provider value={value}>
      {children}
      {request && (
        <PromptDialog
          key={request.id}
          open
          mode={request.mode}
          title={request.title}
          message={request.message}
          label={request.label}
          defaultValue={request.defaultValue}
          type={request.type}
          autoComplete={request.autoComplete}
          confirmLabel={request.confirmLabel}
          cancelLabel={request.cancelLabel}
          destructive={request.destructive}
          onConfirm={(result) => {
            if (request.mode === 'confirm') {
              settle(true)
            } else {
              settle(result)
            }
          }}
          onDismiss={() => {
            settle(request.mode === 'confirm' ? false : null)
          }}
        />
      )}
    </PromptContext.Provider>
  )
}

export function usePrompt() {
  const ctx = useContext(PromptContext)
  if (!ctx) {
    throw new Error('usePrompt must be used within PromptProvider')
  }
  return ctx
}
