import { useCallback } from 'react'
import { AuthProvider as ToolsAuthProvider, useAuth } from '@tools/service'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import { devAutoLoginConfig } from '@/env'

export function AuthProvider({ children }) {
  const onSignedOut = useCallback(() => {
    queryClient.clear()
  }, [])

  return (
    <ToolsAuthProvider
      supabase={supabase}
      appId="toolname"
      onSignedOut={onSignedOut}
      getDevAutoLogin={devAutoLoginConfig}
    >
      {children}
    </ToolsAuthProvider>
  )
}

export { useAuth }
