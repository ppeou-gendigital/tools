export function downloadText(fileName, text, mime = 'application/json') {
  const blob = new Blob([text], { type: mime })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}
