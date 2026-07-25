import { useCallback } from 'react'
import { AuthProvider as ToolsAuthProvider, useAuth } from '@tools/service'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import { devAutoLoginConfig } from '@/env'

export function AuthProvider({ children }) {
  const onSignedOut = useCallback(() => {
    queryClient.clear()
  }, [])

  const finalizeSignup = useCallback(async (userSession, displayName) => {
    if (!userSession?.user?.id || !displayName) return
    const { error } = await supabase.from('profiles').upsert(
      {
        id: userSession.user.id,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    if (error) throw error
  }, [])

  return (
    <ToolsAuthProvider
      supabase={supabase}
      appId="accesso"
      onSignedOut={onSignedOut}
      finalizeSignup={finalizeSignup}
      getDevAutoLogin={devAutoLoginConfig}
    >
      {children}
    </ToolsAuthProvider>
  )
}

export { useAuth }
