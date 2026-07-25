import { useCallback } from 'react'
import { AuthProvider as ToolsAuthProvider, useAuth } from '@tools/service'
import { asyncStorage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import { devAutoLoginConfig } from '@/env'

const LAST_ROUTE_KEY = 'viaggio:lastRoute'

export function AuthProvider({ children }) {
  const onSignedOut = useCallback(() => {
    queryClient.clear()
    // Avoid restoring the previous account's deep link after the next login.
    void asyncStorage.removeItem(LAST_ROUTE_KEY)
  }, [])

  return (
    <ToolsAuthProvider
      supabase={supabase}
      appId="viaggio"
      onSignedOut={onSignedOut}
      getDevAutoLogin={devAutoLoginConfig}
    >
      {children}
    </ToolsAuthProvider>
  )
}

export { useAuth }
