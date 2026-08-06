// Runtime environment helpers.

export function isExtension() {
  return typeof chrome !== 'undefined' && !!chrome?.runtime?.id
}

/** Injected at build time: package.json version + git SHA (e.g. 0.1.0+ed7b435). */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0+local'
