// Clipboard write for the exported table. Chrome requires the document to be
// focused; the popup is, and clipboardWrite covers the lost user gesture after
// an await.

export async function copyHtml(html) {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    await navigator.clipboard.writeText(html)
    return
  }

  const blob = new Blob([html], { type: 'text/html' })
  await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })])
}
