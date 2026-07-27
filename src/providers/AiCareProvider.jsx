import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AiCareOverlay } from '@/blocks/AiCareOverlay'
import {
  openAiCareChat as bridgeOpenChat,
  registerAiCareHandler,
} from '@/lib/ai/aiCareBridge'
import { usePatientVault } from '@/providers/PatientVaultProvider'

const AiCareContext = createContext(null)

export function AiCareProvider({ children }) {
  const vault = usePatientVault()
  const [open, setOpen] = useState(false)

  const openChat = useCallback(
    (patientId) => {
      const id = patientId || vault.patientId
      if (!id) return
      setOpen(true)
    },
    [vault.patientId],
  )

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    return registerAiCareHandler(({ patientId }) => {
      openChat(patientId)
    })
  }, [openChat])

  const patientId = vault.patientId

  const value = useMemo(
    () => ({
      open,
      patientId,
      openChat,
      close,
    }),
    [open, patientId, openChat, close],
  )

  return (
    <AiCareContext.Provider value={value}>
      {children}
      <AiCareOverlay open={open} patientId={patientId} onClose={close} />
    </AiCareContext.Provider>
  )
}

export function useAiCare() {
  const ctx = useContext(AiCareContext)
  if (!ctx) {
    throw new Error('useAiCare must be used inside <AiCareProvider>')
  }
  return ctx
}

/** Imperative open (optional). */
export { bridgeOpenChat as openAiCareChat }
