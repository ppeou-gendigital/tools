/**
 * Trigger a browser download of a UTF-8 text blob.
 * Works in both the web build and the extension popup.
 */
export function downloadTextFile(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke on next tick so the download handshake can finish.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function datafeedFilename(type) {
  const stamp = new Date().toISOString().slice(0, 10)
  return `accesso-${type}-${stamp}.json`
}
