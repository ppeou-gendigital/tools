// Runtime environment helpers.

export function isExtension() {
  return typeof chrome !== 'undefined' && !!chrome?.runtime?.id
}

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Google Maps JavaScript API + Places (doctor office autocomplete). Optional. */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

/** Injected at build time: package.json version + git SHA (e.g. 0.1.0+ed7b435). */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0+local'

/** Firebase AI Logic (Gemini). Hosting project config + App Check. */
export const FIREBASE_AI_ENABLED =
  String(import.meta.env.VITE_FIREBASE_AI_ENABLED || '').toLowerCase() ===
  'true'
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || ''
export const FIREBASE_AUTH_DOMAIN =
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || ''
export const FIREBASE_PROJECT_ID =
  import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
export const FIREBASE_STORAGE_BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
export const FIREBASE_MESSAGING_SENDER_ID =
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID || ''
export const FIREBASE_APPCHECK_SITE_KEY =
  import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY || ''
export const FIREBASE_APPCHECK_USE_ENTERPRISE =
  String(
    import.meta.env.VITE_FIREBASE_APPCHECK_USE_ENTERPRISE || '',
  ).toLowerCase() === 'true'
export const FIREBASE_AI_MODEL =
  import.meta.env.VITE_FIREBASE_AI_MODEL || 'gemini-3.6-flash'

// Sentinel values shipped in `.env.example`. If they leak into a real `.env`,
// every Supabase call fails with an opaque DNS/CORS error. Fail fast instead.
const PLACEHOLDER_URL = 'https://YOUR-PROJECT-REF.supabase.co'
const PLACEHOLDER_KEY = 'your-anon-key-here'

export function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase env vars. Copy .env.example -> .env and fill in ' +
        'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README -> Supabase setup).',
    )
  }
  if (SUPABASE_URL === PLACEHOLDER_URL || SUPABASE_ANON_KEY === PLACEHOLDER_KEY) {
    throw new Error(
      'Supabase env vars still contain the .env.example placeholders. ' +
        'Paste your real Project URL and anon key into .env ' +
        '(Supabase Dashboard -> Project Settings -> API).',
    )
  }
}

// Dev-only auto-login. Both vars must be set AND we must be in a dev build.
// Production builds statically evaluate `import.meta.env.DEV` to false, so
// this whole branch is dead-code-eliminated from `dist/` and `dist-web/`.
export const DEV_AUTOLOGIN_EMAIL = import.meta.env.VITE_DEV_AUTOLOGIN_EMAIL
export const DEV_AUTOLOGIN_TOKEN = import.meta.env.VITE_DEV_AUTOLOGIN_TOKEN

export function devAutoLoginConfig() {
  if (!import.meta.env.DEV) return null
  if (!DEV_AUTOLOGIN_EMAIL || !DEV_AUTOLOGIN_TOKEN) return null
  return { email: DEV_AUTOLOGIN_EMAIL, token: DEV_AUTOLOGIN_TOKEN }
}

export function isDevAutoLoginActive() {
  return devAutoLoginConfig() !== null
}
