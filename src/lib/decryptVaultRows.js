// Shared decrypt loop for credentials / credit-cards list hooks.
//
// Guarantees:
//   - Only the latest generation may publish results (avoids a stale
//     in-flight pass overwriting a newer successful decrypt).
//   - Failures are aggregated into one console warning instead of N.
//   - Callers get `integrityFailed` when every row fails decrypt.

/**
 * @param {object} opts
 * @param {Array} opts.rows
 * @param {(row: object) => Promise<object>} opts.decryptOne
 *   async (row) => successPayload  — throw to mark error
 * @param {(row: object) => object} opts.mapError
 * @param {string} opts.label  e.g. 'credential' | 'credit card'
 * @param {() => boolean} opts.isCurrent  true while this generation is live
 */
export async function decryptVaultRows({
  rows,
  decryptOne,
  mapError,
  label,
  isCurrent,
}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      results: [],
      integrityFailed: false,
      failureCount: 0,
      sampleError: null,
    }
  }

  let failureCount = 0
  let sampleError = null
  const results = await Promise.all(
    rows.map(async (row) => {
      try {
        return await decryptOne(row)
      } catch (err) {
        failureCount += 1
        if (!sampleError) sampleError = err
        return mapError(row)
      }
    }),
  )

  if (!isCurrent()) {
    return {
      results: null,
      integrityFailed: false,
      failureCount,
      sampleError,
    }
  }

  if (failureCount > 0) {
    const name = sampleError?.name || 'Error'
    const message = sampleError?.message || String(sampleError)
    console.warn(
      `[accesso] ${label} decrypt: ${failureCount}/${rows.length} failed` +
        ` (sample: ${name}: ${message})`,
    )
  }

  const integrityFailed = failureCount === rows.length && rows.length > 0
  return { results, integrityFailed, failureCount, sampleError }
}

/** True when the decrypted list is non-empty and every row failed. */
export function isVaultIntegrityFailed(decrypted) {
  return (
    Array.isArray(decrypted) &&
    decrypted.length > 0 &&
    decrypted.every((row) => row?.error === true)
  )
}
