# Offline architecture (Accesso)

## Modes

| Mode | When | UI |
|------|------|-----|
| **Online** | Network available | Full app. Settings → Vault → **Available offline**. |
| **Offline** | Offline **and** vault pack pinned | Unlock → read-only credentials/cards from pack. |
| **Offline empty** | Offline **and** no pack | Instructions to pin while online. |

## Encryption

Same crypto as online:

- Pack stores `vaultMeta` (salt, iterations, verifier, hint) + encrypted credential/card rows
- **Never** stores passphrase, derived key, or decrypted secrets
- Unlock offline: PBKDF2 + verifier check → AES-GCM decrypt in memory only

## Key modules

| Path | Role |
|------|------|
| `src/lib/offline/connectivity.js` | Online/offline signal |
| `src/lib/offline/packStore.js` | IndexedDB (`accesso.offline`) |
| `src/lib/offline/vaultPack.js` | Build/read vault packs |
| `src/providers/OfflineProvider.jsx` | Mode flags + pin API |
| `src/pages/offline/*` | Read-only offline UI |

`scopeId` = Supabase `userId`. Whole vault is one pack.
