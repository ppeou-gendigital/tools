/**
 * Trigger a browser download of a UTF-8 text blob.
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
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function datafeedFilename(type = 'patient') {
  const stamp = new Date().toISOString().slice(0, 10)
  return `docto-${type}-${stamp}.json`
}
