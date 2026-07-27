/**
 * Firebase app bootstrap for AI Logic (+ App Check).
 * Supabase remains auth/data; Firebase hosting project powers Gemini proxy.
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_APPCHECK_SITE_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_APPCHECK_USE_ENTERPRISE,
} from '@/env'

let appCheckReady = false

export function hasFirebaseConfig() {
  return Boolean(
    FIREBASE_API_KEY &&
      FIREBASE_PROJECT_ID &&
      FIREBASE_APP_ID &&
      FIREBASE_MESSAGING_SENDER_ID,
  )
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    throw new Error(
      'Firebase is not configured. Set VITE_FIREBASE_* in .env (see .env.example).',
    )
  }
  if (getApps().length) return getApp()
  return initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN || `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket:
      FIREBASE_STORAGE_BUCKET || `${FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  })
}

/**
 * Initialize App Check once. Required for Firebase AI Logic.
 * In DEV, set self.FIREBASE_APPCHECK_DEBUG_TOKEN=true before init and
 * register the printed token in Firebase Console → App Check.
 */
export function ensureAppCheck() {
  if (appCheckReady) return
  const app = getFirebaseApp()

  if (import.meta.env.DEV && typeof self !== 'undefined') {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN =
      self.FIREBASE_APPCHECK_DEBUG_TOKEN ?? true
  }

  if (!FIREBASE_APPCHECK_SITE_KEY) {
    console.warn(
      '[docto] VITE_FIREBASE_APPCHECK_SITE_KEY missing; AI calls may fail App Check.',
    )
    appCheckReady = true
    return
  }

  const provider = FIREBASE_APPCHECK_USE_ENTERPRISE
    ? new ReCaptchaEnterpriseProvider(FIREBASE_APPCHECK_SITE_KEY)
    : new ReCaptchaV3Provider(FIREBASE_APPCHECK_SITE_KEY)
  initializeAppCheck(app, {
    provider,
    isTokenAutoRefreshEnabled: true,
  })
  appCheckReady = true
}
