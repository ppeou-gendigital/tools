// Clipboard writer for the exported table.
//
// Excel only rebuilds real cells from the `text/html` flavour, and each
// platform spells that differently:
//   macOS    public.html, raw HTML        (NSPasteboard via osascript/JXA)
//   Windows  HTML Format, CF_HTML wrapper (WinForms Clipboard)
//   Linux    text/html                    (xclip / wl-copy)
//
// Anything else degrades to writing a file, which the caller reports.

import { execFile, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { CliError } from './http.mjs'

const run = promisify(execFile)

function tempFile(extension, contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-'))
  const file = path.join(dir, `clipboard.${extension}`)
  fs.writeFileSync(file, contents, 'utf8')
  return file
}

// CF_HTML is a byte-offset header followed by an HTML document. Excel reads the
// header, so a bare HTML string pastes as plain text. Offsets are byte counts,
// not character counts — hence Buffer.byteLength everywhere.
//
// Shape mirrors what Chrome puts on the Windows clipboard:
//   Version:0.9
//   StartHTML / EndHTML           -> the whole <html> document
//   StartFragment / EndFragment   -> just the table
//   blank line, then <html><body>…</body></html>
export function buildCfHtml(fragment, { sourceUrl = '' } = {}) {
  const pad = (value) => String(value).padStart(10, '0')

  // The header ends with a blank line. Every number is fixed-width, so the
  // header's own byte length does not change once the real offsets are known —
  // that is what makes a two-pass build correct.
  const header = (offset) =>
    [
      'Version:0.9',
      `StartHTML:${pad(offset.startHtml)}`,
      `EndHTML:${pad(offset.endHtml)}`,
      `StartFragment:${pad(offset.startFragment)}`,
      `EndFragment:${pad(offset.endFragment)}`,
      ...(sourceUrl ? [`SourceURL:${sourceUrl}`] : []),
      '',
      '',
    ].join('\r\n')

  const zero = { startHtml: 0, endHtml: 0, startFragment: 0, endFragment: 0 }
  const headerLength = Buffer.byteLength(header(zero), 'utf8')

  const prefix = '<html><body>\r\n'
  const suffix = '\r\n</body></html>'
  const startMarker = '<!--StartFragment-->'
  const endMarker = '<!--EndFragment-->'

  const startFragment =
    headerLength + Buffer.byteLength(prefix + startMarker, 'utf8')
  const endFragment = startFragment + Buffer.byteLength(fragment, 'utf8')
  const body = `${prefix}${startMarker}${fragment}${endMarker}${suffix}`
  const endHtml = headerLength + Buffer.byteLength(body, 'utf8')

  return (
    header({
      startHtml: headerLength,
      endHtml,
      startFragment,
      endFragment,
    }) + body
  )
}

const MAC_SCRIPT = `
ObjC.import('AppKit')
function run(argv) {
  const contents = $.NSString.stringWithContentsOfFileEncodingError(
    argv[0], $.NSUTF8StringEncoding, null)
  if (!contents || !contents.length) throw new Error('empty payload')
  const pasteboard = $.NSPasteboard.generalPasteboard
  pasteboard.clearContents
  if (!pasteboard.setStringForType(contents, 'public.html')) {
    throw new Error('NSPasteboard refused public.html')
  }
  return 'ok'
}`

async function copyMac(html) {
  const file = tempFile('html', html)
  try {
    await run('osascript', ['-l', 'JavaScript', '-e', MAC_SCRIPT, file])
  } finally {
    fs.rmSync(path.dirname(file), { recursive: true, force: true })
  }
}

async function copyWindows(html) {
  // The CF_HTML header carries byte offsets into a UTF-8 document. Handing
  // .NET a string makes it re-encode to ANSI and breaks those offsets as soon
  // as a name has an accent, so the bytes go over the clipboard verbatim. The
  // string path stays as a fallback in case a locked-down PowerShell rejects
  // the stream.
  const file = tempFile('html', buildCfHtml(html))
  const literal = file.replace(/'/g, "''")
  const script = [
    'Add-Type -AssemblyName System.Windows.Forms | Out-Null',
    'function Put([object]$data) {',
    '  [System.Windows.Forms.Clipboard]::SetDataObject($data, $true, 5, 120)',
    '}',
    'try {',
    `  $bytes = [System.IO.File]::ReadAllBytes('${literal}')`,
    '  $stream = New-Object System.IO.MemoryStream(,$bytes)',
    '  $data = New-Object System.Windows.Forms.DataObject',
    "  $data.SetData([System.Windows.Forms.DataFormats]::Html, $false, $stream)",
    '  Put $data',
    '} catch {',
    `  $text = [System.IO.File]::ReadAllText('${literal}', [System.Text.Encoding]::UTF8)`,
    '  $data = New-Object System.Windows.Forms.DataObject',
    '  $data.SetData([System.Windows.Forms.DataFormats]::Html, $text)',
    '  Put $data',
    '}',
  ].join('\r\n')

  try {
    await run(
      'powershell.exe',
      ['-NoProfile', '-STA', '-NonInteractive', '-Command', script],
      { windowsHide: true },
    )
  } finally {
    fs.rmSync(path.dirname(file), { recursive: true, force: true })
  }
}

function streamTo(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'ignore', 'pipe'] })
    let stderr = ''
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr.trim() || `${command} exited ${code}`))
    })
    child.stdin.end(input)
  })
}

async function copyLinux(html) {
  try {
    await streamTo('wl-copy', ['--type', 'text/html'], html)
    return 'wl-copy'
  } catch {
    // fall through to X11
  }

  const file = tempFile('html', html)
  try {
    await run('xclip', ['-selection', 'clipboard', '-t', 'text/html', '-i', file])
    return 'xclip'
  } finally {
    fs.rmSync(path.dirname(file), { recursive: true, force: true })
  }
}

// Returns the mechanism used, or throws so the caller can offer --out instead.
export async function copyHtml(html) {
  try {
    if (process.platform === 'darwin') {
      await copyMac(html)
      return 'public.html'
    }
    if (process.platform === 'win32') {
      await copyWindows(html)
      return 'CF_HTML'
    }
    return await copyLinux(html)
  } catch (error) {
    throw new CliError(
      `Could not write the table to the clipboard: ${error?.message ?? error}. Re-run with --out report.xls to save a file instead.`,
      { code: 'clipboard' },
    )
  }
}

// Excel opens an HTML table saved as .xls without complaining about the
// extension, so --out needs no spreadsheet dependency.
export function writeExcelHtml(file, html) {
  const target = /\.(xls|html?)$/i.test(file) ? file : `${file}.xls`
  fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true })
  fs.writeFileSync(
    target,
    `<html><head><meta charset="utf-8"></head><body>${html}</body></html>`,
    'utf8',
  )
  return target
}
