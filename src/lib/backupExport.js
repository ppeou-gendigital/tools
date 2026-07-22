/**
 * Thin wrappers around the patient datafeed (Accesso-style).
 * Prefer importing from `@/lib/datafeed` for new code.
 */
import { exportPatientDatafeed } from '@/lib/datafeed/buildFromVault'
import { downloadTextFile } from '@/lib/datafeed/download'

export async function buildPatientBackup(args) {
  return exportPatientDatafeed(args)
}

export function downloadJson(filename, data) {
  const text =
    typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`
  downloadTextFile(filename, text)
}
