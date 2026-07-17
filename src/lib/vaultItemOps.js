// Pure operators for vault-backed rows (credentials / credit_cards).
// Consumed by applySyncOp({ stream: 'credentials'|'credit_cards', op }).
// Each factory returns `(row) => nextRow | null` that:
//   - Never mutates the input.
//   - Only touches display_name / ciphertext / iv (plus timestamps on write).
//   - Returns the same row reference when the op is a no-op.
//   - Returns null to delete.

function trimDisplayName(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Upsert a vault item row. For create, pass `{ id, userId }` so
 * `op(null)` can build a full insert payload with a client UUID.
 */
export function opUpsertVaultItem({
  id,
  userId,
  displayName,
  ciphertext,
  iv,
  createdAt,
} = {}) {
  const nextName = trimDisplayName(displayName)
  const nextCipher = typeof ciphertext === 'string' ? ciphertext : ''
  const nextIv = typeof iv === 'string' ? iv : ''

  return (row) => {
    if (!row) {
      if (!id || !userId) {
        throw new Error('opUpsertVaultItem: id + userId required for create')
      }
      if (!nextCipher || !nextIv) {
        throw new Error('opUpsertVaultItem: ciphertext + iv required for create')
      }
      const now = new Date().toISOString()
      return {
        id,
        user_id: userId,
        display_name: nextName,
        ciphertext: nextCipher,
        iv: nextIv,
        created_at: createdAt ?? now,
        updated_at: now,
      }
    }

    const sameName = (row.display_name ?? '') === nextName
    const sameCipher = row.ciphertext === nextCipher
    const sameIv = row.iv === nextIv
    if (sameName && sameCipher && sameIv) return row

    return {
      ...row,
      display_name: nextName,
      ciphertext: nextCipher,
      iv: nextIv,
      updated_at: new Date().toISOString(),
    }
  }
}

/** Delete: op returns null regardless of current row. */
export function opDeleteVaultItem() {
  return (row) => {
    if (row == null) return null
    return null
  }
}
