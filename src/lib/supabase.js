import { createClient } from '@supabase/supabase-js'
import { asyncStorage } from './storage'
import { SUPABASE_URL, SUPABASE_ANON_KEY, assertSupabaseEnv } from '@/env'

assertSupabaseEnv()

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: asyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    // We use email OTP (6-digit code), not magic-link redirect, so no need
    // to parse the URL for a session — that flow doesn't work inside a
    // chrome-extension:// popup anyway.
    detectSessionInUrl: false,
    flowType: 'pkce',
    storageKey: 'acceso.auth',
  },
})
