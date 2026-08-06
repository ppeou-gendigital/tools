export async function copyFormattedText(html) {
  const blob = new Blob([html], { type: 'text/html' })
  const data = [new ClipboardItem({ 'text/html': blob })]
  await navigator.clipboard.write(data)
}
